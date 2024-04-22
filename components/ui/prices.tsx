"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStripe } from "@/lib/stripe/client";
import { checkoutWithStripe } from "@/lib/stripe/server";
import type { Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type Subscription = Tables<"subscriptions">;
type Product = Tables<"products">;
type Price = Tables<"prices">;
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  user: User | null | undefined;
  products: ProductWithPrices[] | null;
  subscription: SubscriptionWithProduct | null;
}

type BillingInterval = "year" | "month";

export default function Pricing({ user, products, subscription }: Props) {
  const intervals = Array.from(
    new Set(
      products?.flatMap(
        (product) => product?.prices?.map((price) => price?.interval),
      ),
    ),
  );
  const router = useRouter();
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>("month");
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const currentPath = usePathname();

  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    const { errorRedirect, sessionId } = await checkoutWithStripe(
      price,
      currentPath,
    );

    if (errorRedirect) {
      setPriceIdLoading(undefined);
      return router.push(errorRedirect);
    }

    if (!sessionId) {
      setPriceIdLoading(undefined);
      return router.push(currentPath);
    }

    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });

    setPriceIdLoading(undefined);
  };

  if (!products?.length) {
    return (
      <div>
        <p>We are currently not offering any paid for products!</p>
      </div>
    );
  } else {
    return (
      <>
        <div className="rounded-xl bg-muted px-4 py-2">
          <p className="mb-2 text-sm font-bold">Billing Period</p>
          <div className="flex flex-row items-center gap-2">
            <Label htmlFor="interval">Monthly</Label>
            <Switch
              onCheckedChange={() => {
                setBillingInterval(
                  billingInterval === "month" ? "year" : "month",
                );
              }}
              value={billingInterval}
              id="interval"
            />
            <Label htmlFor="interval">Yearly</Label>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => {
              const price = product?.prices?.find(
                (price) => price.interval === billingInterval,
              );

              if (!price) return null;

              const priceString = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: price.currency!,
                minimumFractionDigits: 0,
              }).format((price?.unit_amount || 0) / 100);
              return (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    {product.description ?? (
                      <span className="italic text-muted-foreground">
                        No Description
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{priceString}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      type="button"
                      onClick={() => handleStripeCheckout(price)}
                    >
                      {subscription ? "Manage" : "Subscribe"}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </>
    );
  }
}
