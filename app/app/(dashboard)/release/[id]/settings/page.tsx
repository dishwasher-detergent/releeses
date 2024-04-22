import Form from "@/components/form";
import DeleteReleaseForm from "@/components/form/delete-release-form";
import { Separator } from "@/components/ui/separator";
import { updateReleaseMetadata } from "@/lib/actions";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function ReleaseSettings({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("release")
    .select()
    .eq("id", decodeURIComponent(params.id))
    .single();

  if (error || !data) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <Form
        title="Release Slug"
        description="The slug is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens."
        helpText="Please use a slug that is unique to this release."
        inputAttrs={{
          name: "slug",
          type: "text",
          defaultValue: data?.slug!,
          placeholder: "slug",
        }}
        handleSubmit={updateReleaseMetadata}
      />
      <Separator />
      <Form
        title="Thumbnail image"
        description="The thumbnail image for your release. Accepted formats: .png, .jpg, .jpeg"
        helpText="Max file size 50MB. Recommended size 1200x630."
        inputAttrs={{
          name: "image",
          type: "file",
          defaultValue: data?.image!,
        }}
        handleSubmit={updateReleaseMetadata}
      />
      <Separator />
      <DeleteReleaseForm
        orgId={data.organizationId}
        releaseName={data?.title!}
      />
    </div>
  );
}
