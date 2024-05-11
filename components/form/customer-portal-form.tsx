"use client";

import { Loader } from "@/components/loading/loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Prices from "@/components/ui/prices";
import { createStripePortal } from "@/lib/stripe/server";
import { Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type Subscription = Tables<"subscriptions">;
type Price = Tables<"prices">;
type Product = Tables<"products">;

interface ProductWithPrices extends Product {
  prices: Price[];
}

type SubscriptionWithPriceAndProduct = Subscription & {
  prices:
    | (Price & {
        products: Product | null;
      })
    | null;
};

interface Props {
  user: User | null | undefined;
  products: ProductWithPrices[] | null;
  subscription: SubscriptionWithPriceAndProduct | null;
}

export default function CustomerPortalForm({
  subscription,
  products,
  user,
}: Props) {
  const router = useRouter();
  const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getPriceString = (
    subscription: SubscriptionWithPriceAndProduct | null,
  ) => {
    const currency = subscription?.prices?.currency || "USD";
    const amount = (subscription?.prices?.unit_amount || 0) / 100;

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleStripePortalRequest = async () => {
    setIsSubmitting(true);
    try {
      const redirectUrl = await createStripePortal(currentPath);
      router.push(redirectUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const priceString = getPriceString(subscription);

  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <div className="relative flex flex-col space-y-4 p-4">
        <h2 className="text-xl font-bold">Your Plan</h2>
        <div className="flex flex-row">
          {subscription ? (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>{subscription?.prices?.products?.name}</CardTitle>
                <CardDescription>
                  {subscription?.prices?.products?.description ?? (
                    <span className="italic text-muted-foreground">
                      No Description
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-black">
                  {priceString}/{subscription?.prices?.interval}
                </p>
              </CardContent>
            </Card>
          ) : (
            <p>You are not currently subscribed to any plan.</p>
          )}
        </div>
        <div>{!subscription && <Prices products={products} />}</div>
      </div>
      <div className="flex flex-row items-center justify-between rounded-b-xl border-t bg-muted px-4 py-2">
        <p className="text-sm text-foreground">
          Manage your subscriptions on Stripe.
        </p>
        <FormButton
          onClick={handleStripePortalRequest}
          loading={isSubmitting}
        />
      </div>
    </div>
  );
}

function FormButton({
  onClick,
  loading = false,
}: {
  onClick?: () => void;
  loading?: boolean;
}) {
  return (
    <Button disabled={loading} size="sm" onClick={onClick}>
      {loading && <Loader className="mr-2 size-4 text-white" />}
      Open Customer Portal
    </Button>
  );
}
