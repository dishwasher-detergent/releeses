import Form from "@/components/form";
import DeleteOrgForm from "@/components/form/delete-org-form";
import { updateOrganization } from "@/lib/actions";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function OrgSettingsIndex({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("organization")
    .select()
    .eq("id", decodeURIComponent(params.id))
    .single();

  if (error || !data) {
    notFound();
  }

  return (
    <>
      <Form
        title="Name"
        description="The name of your organization. This will be used as the meta title on Google as well."
        helpText="Please use 32 characters maximum."
        inputAttrs={{
          name: "name",
          type: "text",
          defaultValue: data?.name!,
          placeholder: "My Awesome organization",
          maxLength: 32,
        }}
        handleSubmit={updateOrganization}
      />
      <Form
        title="Description"
        description="The description of your organization. This will be used as the meta description on Google as well."
        helpText="Include SEO-optimized keywords that you want to rank for."
        inputAttrs={{
          name: "description",
          type: "text",
          defaultValue: data?.description!,
          placeholder: "A blog about really interesting things.",
        }}
        handleSubmit={updateOrganization}
      />
      <DeleteOrgForm organizationName={data?.name!} />
    </>
  );
}
