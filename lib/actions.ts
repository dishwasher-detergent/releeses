"use server";

import { Organization } from "@/interfaces/organization";
import { Release } from "@/interfaces/release";
import { User } from "@/interfaces/user";
import { db, storage } from "@/lib/appwrite";
import { getSession, withOrgAuth, withReleaseAuth } from "@/lib/auth";
import {
  ENDPOINT,
  ORGANIZATION_BUCKET_ID,
  ORGANIZATION_COLLECTION_ID,
  PROJECT_ID,
  RELEASE_BUCKET_ID,
  RELEASE_COLLECTION_ID,
  USER_COLLECTION_ID,
} from "@/lib/constants";
import {
  addDomainToVercel,
  // getApexDomain,
  removeDomainFromVercelProject,
  // removeDomainFromVercelTeam,
  validDomainRegex,
} from "@/lib/domains";
import { getBlurDataURL } from "@/lib/utils";
import { customAlphabet } from "nanoid";
import { revalidateTag } from "next/cache";
import { InputFile } from "node-appwrite";

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7,
); // 7-character random string

export const createOrganization = async (formData: FormData) => {
  const session = await getSession();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const subdomain = formData.get("subdomain") as string;

  const user = await db.get<User>(USER_COLLECTION_ID, session.user.id);

  if (user.organizationCount >= 3) {
    return {
      error: "You've hit the max amount of organizations allowed.",
    };
  }

  try {
    const response = await db.create(ORGANIZATION_COLLECTION_ID, {
      name: name,
      description: description,
      subdomain: subdomain,
      user: session.user.id,
      userId: session.user.id,
    });

    await db.update(
      USER_COLLECTION_ID,
      {
        organizationCount: (user.organizationCount ?? 0) + 1,
      },
      session.user.id,
    );

    await revalidateTag(
      `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
    );
    return response as Organization;
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
  async (formData: FormData, organization: Organization, key: string) => {
    const value = formData.get(key) as string;

    try {
      let response;

      if (key === "customDomain") {
        if (value.includes("vercel.pub")) {
          return {
            error: "Cannot use vercel.pub subdomain as your custom domain",
          };

          // if the custom domain is valid, we need to add it to Vercel
        } else if (validDomainRegex.test(value)) {
          response = await db.update(
            ORGANIZATION_COLLECTION_ID,
            {
              customDomain: value,
            },
            organization.$id,
          );
          await Promise.all([
            addDomainToVercel(value),
            // Optional: add www subdomain as well and redirect to apex domain
            // addDomainToVercel(`www.${value}`),
          ]);

          // empty value means the user wants to remove the custom domain
        } else if (value === "") {
          response = await db.update(
            ORGANIZATION_COLLECTION_ID,
            {
              customDomain: null,
            },
            organization.$id,
          );
        }

        // if the site had a different customDomain before, we need to remove it from Vercel
        if (organization.customDomain && organization.customDomain !== value) {
          response = await removeDomainFromVercelProject(
            organization.customDomain,
          );

          /* Optional: remove domain from Vercel team 

          // first, we need to check if the apex domain is being used by other sites
          const apexDomain = getApexDomain(`https://${site.customDomain}`);
          const domainCount = await prisma.site.count({
            where: {
              OR: [
                {
                  customDomain: apexDomain,
                },
                {
                  customDomain: {
                    endsWith: `.${apexDomain}`,
                  },
                },
              ],
            },
          });

          // if the apex domain is being used by other sites
          // we should only remove it from our Vercel project
          if (domainCount >= 1) {
            await removeDomainFromVercelProject(site.customDomain);
          } else {
            // this is the only site using this apex domain
            // so we can remove it entirely from our Vercel team
            await removeDomainFromVercelTeam(
              site.customDomain
            );
          }
          
          */
        }
      } else if (key === "image" || key === "logo") {
        const file = formData.get(key) as File;
        const filename = `${nanoid()}.${file.type.split("/")[1]}`;
        const newfile = await InputFile.fromBlob(file, filename);

        const awFile = await storage.upload(ORGANIZATION_BUCKET_ID, newfile);
        const url = `${ENDPOINT}/storage/buckets/${ORGANIZATION_BUCKET_ID}/files/${awFile.$id}/view?project=${PROJECT_ID}`;
        const blurhash = key === "image" ? await getBlurDataURL(url) : null;

        response = await db.update(
          ORGANIZATION_COLLECTION_ID,
          {
            [key]: url,
            ...(blurhash && { imageBlurhash: blurhash }),
          },
          organization.$id,
        );
      } else {
        response = await db.update(
          ORGANIZATION_COLLECTION_ID,
          {
            [key]: value,
          },
          organization.$id,
        );
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
  async (_: FormData, organization: Organization) => {
    const session = await getSession();

    const user = await db.get<User>(USER_COLLECTION_ID, session.user.id);

    try {
      const response = await db.delete(
        ORGANIZATION_COLLECTION_ID,
        organization.$id,
      );

      const count =
        (user.organizationCount ?? 0) == 0 ? 0 : user.organizationCount - 1;

      await db.update(
        USER_COLLECTION_ID,
        {
          organizationCount: count,
        },
        session.user.id,
      );

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

export const getOrganizationFromReleaseId = async (releaseId: string) => {
  const release = await db.get<Release>(RELEASE_COLLECTION_ID, releaseId);
  return release.organizationId;
};

export const createRelease = withOrgAuth(
  async (_: FormData, organization: Organization) => {
    const session = {
      user: {
        id: 1,
      },
    };
    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }

    const response = await db.create(RELEASE_COLLECTION_ID, {
      organization: organization.$id,
      organizationId: organization.$id,
      subdomain: organization.subdomain,
      customDomain: organization.customDomain,
      user: "1",
      userId: "1",
    });

    await db.update(
      RELEASE_COLLECTION_ID,
      {
        slug: response.$id,
      },
      response.$id,
    );

    await revalidateTag(
      `${organization.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-releases`,
    );
    organization?.customDomain &&
      (await revalidateTag(`${organization.customDomain}-releases`));

    return response as Release;
  },
);

// creating a separate function for this because we're not using FormData
export const updateRelease = async (data: Release) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  const release = await db.get<Release>(RELEASE_COLLECTION_ID, data.$id);
  if (!release || release.user.$id !== session.user.id) {
    return {
      error: "Release not found",
    };
  }
  try {
    const response = await db.update(
      RELEASE_COLLECTION_ID,
      {
        title: data.title,
        description: data.description,
        content: data.content,
        contentJson: data.contentJson,
      },
      data.$id,
    );

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
  async (formData: FormData, release: Release, key: string) => {
    const value = formData.get(key) as string;

    try {
      let response;
      if (key === "image") {
        const file = formData.get(key) as File;
        const filename = `${nanoid()}.${file.type.split("/")[1]}`;
        const newfile = await InputFile.fromBlob(file, filename);

        const awFile = await storage.upload(RELEASE_BUCKET_ID, newfile);
        const url = `${ENDPOINT}/storage/buckets/${RELEASE_BUCKET_ID}/files/${awFile.$id}/view?project=${PROJECT_ID}`;
        const blurhash = await getBlurDataURL(url);

        response = await db.update(
          RELEASE_COLLECTION_ID,
          {
            image: url,
            imageBlurhash: blurhash,
          },
          release.$id,
        );
      } else {
        response = await db.update(
          RELEASE_COLLECTION_ID,
          {
            [key]: key === "published" ? value === "true" : value,
          },
          release.$id,
        );
      }

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
  async (_: FormData, release: Release) => {
    try {
      const response = await db.delete(RELEASE_COLLECTION_ID, release.$id);
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
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  const value = formData.get(key) as string;

  try {
    const response = await db.update(
      RELEASE_COLLECTION_ID,
      {
        [key]: value,
      },
      session.user.id,
    );
    return response;
  } catch (error: any) {
    if (error.code === "P2002") {
      return {
        error: `This ${key} is already in use`,
      };
    } else {
      return {
        error: error.message,
      };
    }
  }
};
