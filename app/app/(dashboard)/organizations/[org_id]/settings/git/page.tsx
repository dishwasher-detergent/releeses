import Form from "@/components/form";
import { updateOrganization } from "@/lib/actions";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function OrgSettingsGit({
  params,
}: {
  params: { org_id: string };
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("organization")
    .select("organization, repository")
    .eq("id", decodeURIComponent(params.org_id))
    .single();

  if (error || !data) {
    notFound();
  }

  return (
    <>
      <Form
        title="Organization"
        description="Your Github organization or user name."
        helpText="Include this to be able to pull in data from Github."
        inputAttrs={{
          name: "organization",
          type: "text",
          defaultValue: data?.organization!,
          placeholder: "dishwasher-detergent",
        }}
        handleSubmit={updateOrganization}
      />
      <Form
        title="Repository"
        description="Your Github repository."
        helpText="Include this to be able to pull in data from Github."
        inputAttrs={{
          name: "repository",
          type: "text",
          defaultValue: data?.repository!,
          placeholder: "releeses",
        }}
        handleSubmit={updateOrganization}
      />
    </>
  );
}
