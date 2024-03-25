import Form from "@/components/form";
import DeleteOrgForm from "@/components/form/delete-org-form";
import { Separator } from "@/components/ui/separator";
import { Organization } from "@/interfaces/organization";
import { updateOrganization } from "@/lib/actions";
import { db } from "@/lib/appwrite";
import { ORGANIZATION_COLLECTION_ID } from "@/lib/constants";

export default async function OrgSettingsIndex({
  params,
}: {
  params: { id: string };
}) {
  const data = await db.get<Organization>(
    ORGANIZATION_COLLECTION_ID,
    decodeURIComponent(params.id),
  );

  return (
    <div className="flex flex-col">
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
      <Separator />
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
      <Separator />
      <DeleteOrgForm organizationName={data?.name!} />
    </div>
  );
}
