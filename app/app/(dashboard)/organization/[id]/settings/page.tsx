import Form from "@/components/form";
import DeleteSiteForm from "@/components/form/delete-site-form";
import { Organization } from "@/interfaces/organization";
import { updateOrganization } from "@/lib/actions";
import { db } from "@/lib/appwrite";
import { ORGANIZATION_COLLECTION_ID } from "@/lib/constants";

export default async function SiteSettingsIndex({
  params,
}: {
  params: { id: string };
}) {
  const data = await db.get<Organization>(
    ORGANIZATION_COLLECTION_ID,
    decodeURIComponent(params.id),
  );

  return (
    <div className="flex flex-col space-y-6">
      <Form
        title="Name"
        description="The name of your site. This will be used as the meta title on Google as well."
        helpText="Please use 32 characters maximum."
        inputAttrs={{
          name: "name",
          type: "text",
          defaultValue: data?.name!,
          placeholder: "My Awesome Site",
          maxLength: 32,
        }}
        handleSubmit={updateOrganization}
      />

      <Form
        title="Description"
        description="The description of your site. This will be used as the meta description on Google as well."
        helpText="Include SEO-optimized keywords that you want to rank for."
        inputAttrs={{
          name: "description",
          type: "text",
          defaultValue: data?.description!,
          placeholder: "A blog about really interesting things.",
        }}
        handleSubmit={updateOrganization}
      />

      <DeleteSiteForm siteName={data?.name!} />
    </div>
  );
}
