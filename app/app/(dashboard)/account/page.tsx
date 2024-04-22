import CustomerPortalForm from "@/components/form/customer-portal-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Account() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("*, prices(id, *, products(id, *))")
    .in("status", ["trialing", "active"])
    .maybeSingle();

  if (error) {
    console.log(error);
  }

  const { data: products } = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("active", true)
    .eq("prices.active", true)
    .order("metadata->index")
    .order("unit_amount", { referencedTable: "prices" });

  if (error) {
    console.log(error);
  }

  if (!user) {
    return redirect("/signin");
  }

  return (
    <CustomerPortalForm
      subscription={subscription}
      products={products}
      user={user}
    />
  );
}
