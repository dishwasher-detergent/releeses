"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Tables } from "@/types/supabase";

type Product = Tables<"products">;
type Price = Tables<"prices">;
interface ProductWithPrices extends Product {
  prices: Price[];
}

interface Props {
  products: ProductWithPrices[] | null;
}

export default function Pricing({ products }: Props) {
  if (!products?.length) {
    return (
      <p className="mx-4 md:row-start-3">
        We are currently not offering any paid for products!
      </p>
    );
  } else {
    return (
      <>
        <div className="mx-4 md:col-start-2 md:row-start-4">
          {products?.map((product) => {
            const price = product?.prices?.find(
              (price) => price.type === "one_time",
            );

            if (!price) return null;

            const priceString = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: price.currency!,
              minimumFractionDigits: 0,
            }).format((price?.unit_amount || 0) / 100);
            return (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="py-12">
                  <p className="text-3xl font-black">{priceString}/Lifetime</p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" type="button" asChild className="w-full">
                    <a
                      target="_blank"
                      href={`${process.env.NEXT_PUBLIC_DOMAIN?.split("//").join(
                        "//app.",
                      )}/account`}
                    >
                      Purchase
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </>
    );
  }
}
