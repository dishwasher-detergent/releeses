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
import type { Tables } from "@/types/supabase";
import { useState } from "react";

type Product = Tables<"products">;
type Price = Tables<"prices">;
interface ProductWithPrices extends Product {
  prices: Price[];
}

interface Props {
  products: ProductWithPrices[] | null;
}

type BillingInterval = "year" | "month";

export default function Pricing({ products }: Props) {
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>("month");

  if (!products?.length) {
    return (
      <p className="mx-4 md:row-start-3">
        We are currently not offering any paid for products!
      </p>
    );
  } else {
    return (
      <>
        <div className="rounded-xl bg-muted px-4 py-2 md:col-start-2 md:row-start-3">
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
        <div className="md:col-span-3 md:row-start-4">
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
                      <Button size="sm" type="button" asChild>
                        <a
                          target="_blank"
                          href={`${process.env.NEXT_PUBLIC_DOMAIN?.split(
                            "//",
                          ).join("//app.")}/account`}
                        >
                          Subscribe
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </>
    );
  }
}
