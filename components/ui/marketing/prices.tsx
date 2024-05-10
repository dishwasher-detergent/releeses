"use client";

import { Button } from "@/components/ui/button";
import type { Tables } from "@/types/supabase";
import { LucideCheck } from "lucide-react";
import { Badge } from "../badge";

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
  if (!products || products.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {products
        .sort((a, b) => getOneTimePrice(a.prices) - getOneTimePrice(b.prices))
        .map((product) => {
          const price = product?.prices?.find(
            (price) => price.type === "one_time",
          );

          if (!price) return null;

          const priceString = formatPrice(price);

          return (
            <div key={product.id}>
              <div className="flex justify-end">
                <Badge>{product.name}</Badge>
              </div>
              <p className="mb-2 text-sm text-white">{product.description}</p>
              <h4 className="text-5xl font-black text-white">
                {priceString}
                <span className="text-base font-semibold">/Lifetime</span>
              </h4>
              <ul className="my-8 text-white">
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
                asChild
                className="w-full bg-emerald-600 ring-2 ring-emerald-400 transition-all hover:bg-emerald-700 hover:ring-4 hover:ring-emerald-500"
              >
                <a
                  target="_blank"
                  href={`${process.env.NEXT_PUBLIC_DOMAIN?.split("//").join(
                    "//app.",
                  )}/${price.unit_amount == 0 ? "" : "account"}`}
                >
                  {price.unit_amount == 0 ? "Get Started!" : "Purchase!"}
                </a>
              </Button>
            </div>
          );
        })}
    </div>
  );
}
