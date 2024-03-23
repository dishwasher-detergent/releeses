import Form from "@/components/form";
import { Separator } from "@/components/ui/separator";
import { Organization } from "@/interfaces/organization";
import { updateOrganization } from "@/lib/actions";
import { db } from "@/lib/appwrite";
import { ORGANIZATION_COLLECTION_ID } from "@/lib/constants";

export default async function SiteSettingsDomains({
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
        title="Subdomain"
        description="The subdomain for your site."
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
      <Separator />
      <Form
        title="Custom Domain"
        description="The custom domain for your site."
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
    </div>
  );
}
