import Form from "@/components/form";
import { Separator } from "@/components/ui/separator";
import { Organization } from "@/interfaces/organization";
import { updateOrganization } from "@/lib/actions";
import { db } from "@/lib/appwrite";
import { ORGANIZATION_COLLECTION_ID } from "@/lib/constants";

export default async function OrgSettingsAppearance({
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
        title="Thumbnail image"
        description="The thumbnail image for your organization. Accepted formats: .png, .jpg, .jpeg"
        helpText="Max file size 50MB. Recommended size 1200x630."
        inputAttrs={{
          name: "image",
          type: "file",
          defaultValue: data?.image!,
        }}
        handleSubmit={updateOrganization}
      />
      <Separator />
      <Form
        title="Logo"
        description="The logo for your organization. Accepted formats: .png, .jpg, .jpeg"
        helpText="Max file size 50MB. Recommended size 400x400."
        inputAttrs={{
          name: "logo",
          type: "file",
          defaultValue: data?.logo!,
        }}
        handleSubmit={updateOrganization}
      />
      <Separator />
      <Form
        title="Font"
        description="The font for the heading text your organization."
        helpText="Please select a font."
        inputAttrs={{
          name: "font",
          type: "select",
          defaultValue: data?.font!,
        }}
        handleSubmit={updateOrganization}
      />
      <Separator />
      <Form
        title="404 Page Message"
        description="Message to be displayed on the 404 page."
        helpText="Please use 240 characters maximum."
        inputAttrs={{
          name: "message404",
          type: "text",
          defaultValue: data?.message404!,
          placeholder: "Blimey! You've found a page that doesn't exist.",
          maxLength: 240,
        }}
        handleSubmit={updateOrganization}
      />
    </div>
  );
}
