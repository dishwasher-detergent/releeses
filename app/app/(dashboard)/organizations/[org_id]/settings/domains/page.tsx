import Form from "@/components/form";
import { updateOrganization } from "@/lib/actions";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function OrgSettingsDomains({
  params,
}: {
  params: { org_id: string };
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("organization")
    .select()
    .eq("id", decodeURIComponent(params.org_id))
    .single();

  if (error || !data) {
    notFound();
  }

  return (
    <>
      <Form
        title="Subdomain"
        description="The subdomain for your organization."
        helpText="Please use 32 characters maximum."
        inputAttrs={{
          name: "subdomain",
          type: "text",
          defaultValue: data?.subdomain!,
          placeholder: "subdomain",
          maxLength: 32,
        }}
        handleSubmit={updateOrganization}
      />
      <Form
        title="Custom Domain"
        description="The custom domain for your organization."
        helpText="Please enter a valid domain."
        inputAttrs={{
          name: "customDomain",
          type: "text",
          defaultValue: data?.customDomain!,
          placeholder: "yourdomain.com",
          maxLength: 64,
          pattern: "^[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}$",
        }}
        handleSubmit={updateOrganization}
      />
    </>
  );
}
