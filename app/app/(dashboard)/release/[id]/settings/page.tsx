import Form from "@/components/form";
import DeleteReleaseForm from "@/components/form/delete-release-form";
import { Separator } from "@/components/ui/separator";
import { Release } from "@/interfaces/release";
import { updateReleaseMetadata } from "@/lib/actions";
import { db } from "@/lib/appwrite";
import { getSession } from "@/lib/auth";
import { RELEASE_COLLECTION_ID } from "@/lib/constants";
import { notFound, redirect } from "next/navigation";

export default async function ReleaseSettings({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const data = await db.get<Release>(
    RELEASE_COLLECTION_ID,
    decodeURIComponent(params.id),
  );
  if (!data || data.userId !== session.user.id) {
    notFound();
  }
  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-background">
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
