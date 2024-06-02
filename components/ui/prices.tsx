"use client";

import { Loader } from "@/components/loading/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStripe } from "@/lib/stripe/client";
import { checkoutWithStripe } from "@/lib/stripe/server";
import type { Tables } from "@/types/supabase";
import { LucideCheck } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type Product = Tables<"products">;
type Price = Tables<"prices">;
interface ProductWithPrices extends Product {
  prices: Price[];
}

interface Props {
  products: ProductWithPrices[] | null;
}

// Helper function to get the one-time price
const getOneTimePrice = (prices: Price[]) => {
  return prices?.find((price) => price.type === "one_time")?.unit_amount || 0;
};

// Helper function to format the price
const formatPrice = (price: Price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency!,
    minimumFractionDigits: 0,
  }).format((price?.unit_amount || 0) / 100);
};

export default function Pricing({ products }: Props) {
  const router = useRouter();
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

  if (!products || products.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
      {products
        .sort((a, b) => getOneTimePrice(a.prices) - getOneTimePrice(b.prices))
        .map((product) => {
          const price = product?.prices?.find(
            (price) => price.type === "one_time",
          );

          if (!price) return null;

          const priceString = formatPrice(price);

          return (
            <div key={product.id} className="rounded-lg border p-2">
              <div className="flex justify-end">
                <Badge>{product.name}</Badge>
              </div>
              <p className="mb-2 text-sm text-foreground">
                {product.description}
              </p>
              <h4 className="text-text-foreground text-5xl font-black">
                {priceString}
                <span className="text-base font-semibold">/Lifetime</span>
              </h4>
              <ul className="text-text-foreground my-8">
                {Object.entries(product.metadata || {}).map(([key, value]) => (
                  <li key={key} className="flex flex-row items-center gap-2">
                    {["org", "release", "roadmap"].includes(key) && (
                      <>
                        <LucideCheck className="size-4 text-emerald-500" />
                        <p>{value}</p>
                      </>
                    )}
                  </li>
                ))}
              </ul>
              <Button
                size="sm"
                type="button"
                onClick={() => handleStripeCheckout(price)}
                className="w-full bg-emerald-600 ring-2 ring-emerald-400 transition-all hover:bg-emerald-700 hover:ring-4 hover:ring-emerald-500"
              >
                {priceIdLoading && (
                  <Loader className="mr-2 size-4 text-white" />
                )}
                {price.unit_amount == 0 ? "Get Started!" : "Purchase!"}
              </Button>
            </div>
          );
        })}
    </div>
  );
}
