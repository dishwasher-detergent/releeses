"use server";

import { getSession, withOrgAuth, withReleaseAuth } from "@/lib/auth";
import {
  addDomainToVercel,
  // getApexDomain,
  removeDomainFromVercelProject,
  // removeDomainFromVercelTeam,
  validDomainRegex,
} from "@/lib/domains";
import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/types/supabase";
import { customAlphabet } from "nanoid";
import { revalidateTag } from "next/cache";
import { InputFile } from "node-appwrite";

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7,
); // 7-character random string

export const createOrganization = async (formData: FormData) => {
  const supabase = createClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const subdomain = formData.get("subdomain") as string;

  try {
    const response = await supabase
      .from("organization")
      .insert([
        {
          name: name,
          description: description,
          subdomain: subdomain,
        },
      ])
      .select()
      .single();

    await revalidateTag(
      `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
    );

    return {
      data: {
        id: response.data?.id,
      },
    };
  } catch (error: any) {
    if (error.code === "P2002") {
      return {
        error: `This subdomain is already taken`,
      };
    } else {
      return {
        error: error.message,
      };
    }
  }
};

export const updateOrganization = withOrgAuth(
  async (
    formData: FormData,
    organization: Tables<"organization">,
    key: string,
  ) => {
    const value = formData.get(key) as string;
    const supabase = createClient();

    try {
      let response;

      if (key === "customDomain") {
        if (validDomainRegex.test(value)) {
          response = await supabase
            .from("organization")
            .update({
              customDomain: value,
            })
            .eq("id", organization.id)
            .select();

          await Promise.all([addDomainToVercel(value)]);
        } else if (value === "") {
          response = await supabase
            .from("organization")
            .update({
              customDomain: null,
            })
            .eq("id", organization.id)
            .select();
        }

        if (organization.customDomain && organization.customDomain !== value) {
          response = await removeDomainFromVercelProject(
            organization.customDomain,
          );
        }
      } else if (key === "image" || key === "logo") {
        const file = formData.get(key) as File;
        const filename = `${nanoid()}.${file.type.split("/")[1]}`;
        const newfile = await InputFile.fromBlob(file, filename);

        // const awFile = await storage.upload(ORGANIZATION_BUCKET_ID, newfile);
        // const url = `${ENDPOINT}/storage/buckets/${ORGANIZATION_BUCKET_ID}/files/${awFile.$id}/view?project=${PROJECT_ID}`;
        const blurhash = key === "image" ? "test" : null;
        const url = "test";

        response = await supabase
          .from("organization")
          .update({
            [key]: url,
            ...(blurhash && { imageBlurhash: blurhash }),
          })
          .eq("id", organization.id)
          .select();
      } else {
        response = await supabase
          .from("organization")
          .update({
            [key]: value,
          })
          .eq("id", organization.id)
          .select();
      }
      await revalidateTag(
        `${organization.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
      );
      organization.customDomain &&
        (await revalidateTag(`${organization.customDomain}-metadata`));

      return response;
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          error: `This ${key} is already taken`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);

export const deleteOrganization = withOrgAuth(
  async (_: FormData, organization: Tables<"organization">) => {
    const session = await getSession();
    const supabase = createClient();

    try {
      const response = await supabase
        .from("organization")
        .delete()
        .eq("id", organization.id);

      // const count =
      //   (user.organizationCount ?? 0) == 0 ? 0 : user.organizationCount - 1;

      // await db.update(
      //   USER_COLLECTION_ID,
      //   {
      //     organizationCount: count,
      //   },
      //   session.user?.id,
      // );

      await revalidateTag(
        `${organization.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
      );
      organization.customDomain &&
        (await revalidateTag(`${organization.customDomain}-metadata`));
      return response;
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  },
);

export const getOrganizationFromReleaseId = async (releaseId: number) => {
  const supabase = createClient();
  let { data: organizationId, error } = await supabase
    .from("release")
    .select("organizationId")
    .eq("id", releaseId)
    .single();

  return organizationId;
};

export const createRelease = withOrgAuth(
  async (_: FormData, organization: Tables<"organization">) => {
    const session = await getSession();
    const supabase = createClient();

    if (!session.user?.id) {
      return {
        error: "Not authenticated",
      };
    }

    const { data, error } = await supabase
      .from("release")
      .insert({
        organizationId: organization.id,
      })
      .select()
      .single();

    await revalidateTag(
      `${organization.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-releases`,
    );
    organization?.customDomain &&
      (await revalidateTag(`${organization.customDomain}-releases`));

    return data;
  },
);

// creating a separate function for this because we're not using FormData
export const updateRelease = async (data: Tables<"release">) => {
  const session = await getSession();
  const supabase = createClient();

  if (!session.user?.id) {
    return {
      error: "Not authenticated",
    };
  }

  // const release = await db.get<Release>(RELEASE_COLLECTION_ID, data.$id);

  const { data: release } = await supabase
    .from("release")
    .select("*, organization (subdomain, customDomain)")
    .eq("id", data.id)
    .single();

  if (!release || release?.user_id !== session.user?.id) {
    return {
      error: "Release not found",
    };
  }
  try {
    const { data: response } = await supabase
      .from("release")
      .update({
        title: data.title,
        description: data.description,
        content: data.content,
        contentJson: data.contentJson,
      })
      .eq("id", data.id)
      .select();

    await revalidateTag(
      `${release.organization?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-releases`,
    );
    await revalidateTag(
      `${release.organization?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${release.slug}`,
    );

    // if the site has a custom domain, we need to revalidate those tags too
    release.organization?.customDomain &&
      (await revalidateTag(`${release.organization?.customDomain}-releases`),
      await revalidateTag(
        `${release.organization?.customDomain}-${release.slug}`,
      ));

    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const updateReleaseMetadata = withReleaseAuth(
  async (formData: FormData, release: Tables<"release">, key: string) => {
    const supabase = createClient();
    const value = formData.get(key) as string;
    let customDomain;
    let subdomain;

    try {
      if (key === "image") {
        const file = formData.get(key) as File;
        const filename = `${nanoid()}.${file.type.split("/")[1]}`;
        const newfile = await InputFile.fromBlob(file, filename);

        // const awFile = await storage.upload(RELEASE_BUCKET_ID, newfile);
        // const url = `${ENDPOINT}/storage/buckets/${RELEASE_BUCKET_ID}/files/${awFile.$id}/view?project=${PROJECT_ID}`;
        // const blurhash = await getBlurDataURL(url);

        const blurhash = key === "image" ? "test" : null;
        const url = "test";

        let response = await supabase
          .from("release")
          .update({
            image: url,
            imageBlurhash: blurhash,
          })
          .eq("id", release.id)
          .select("*, organization(subdomain, customDomain)")
          .single();

        customDomain = response.data?.organization?.customDomain;
        subdomain = response.data?.organization?.subdomain;
      } else {
        let response = await supabase
          .from("release")
          .update({
            [key]: key === "published" ? value === "true" : value,
          })
          .eq("id", release.id)
          .select("*, organization(subdomain, customDomain)")
          .single();

        customDomain = response.data?.organization?.customDomain;
        subdomain = response.data?.organization?.subdomain;
      }

      await revalidateTag(
        `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-releases`,
      );
      await revalidateTag(
        `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${release.slug}`,
      );

      // if the site has a custom domain, we need to revalidate those tags too
      customDomain &&
        (await revalidateTag(`${customDomain}-releases`),
        await revalidateTag(`${customDomain}-${release.slug}`));

      return;
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          error: `This slug is already in use`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);

export const deleteRelease = withReleaseAuth(
  async (_: FormData, release: Tables<"release">) => {
    const supabase = createClient();

    try {
      const response = await supabase
        .from("release")
        .delete()
        .eq("id", release.id);
      return response;
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  },
);

export const editUser = async (
  formData: FormData,
  _id: unknown,
  key: string,
) => {
  // const supabase = createClient();
  // const session = await getSession();
  // if (!session.user?.id) {
  //   return {
  //     error: "Not authenticated",
  //   };
  // }
  // const value = formData.get(key) as string;
  // try {
  //   const response = await db.update(
  //     RELEASE_COLLECTION_ID,
  //     {
  //       [key]: value,
  //     },
  //     session.user?.id,
  //   );
  //   const response = await supabase.from("release").update({
  //     [key]: value,
  //   }).eq("id")
  //   return response;
  // } catch (error: any) {
  //   if (error.code === "P2002") {
  //     return {
  //       error: `This ${key} is already in use`,
  //     };
  //   } else {
  //     return {
  //       error: error.message,
  //     };
  //   }
  // }
};
