import { Organization } from "@/interfaces/organization";
import { Release } from "@/interfaces/release";
import { db } from "@/lib/appwrite";
import {
  ORGANIZATION_COLLECTION_ID,
  RELEASE_COLLECTION_ID,
} from "@/lib/constants";

export function getSession() {
  return {
    user: {
      id: "1",
      name: "Kenny",
      username: "KennyBass",
      email: "test@test.com",
      image:
        "https://images.unsplash.com/photo-1704236041747-615d800a8b0a?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  };
}

export function withOrgAuth(action: any) {
  return async (
    formData: FormData | null,
    orgId: string,
    key: string | null,
  ) => {
    const session = await getSession();

    if (!session) {
      return {
        error: "Not authenticated",
      };
    }

    const org = await db.get<Organization>(ORGANIZATION_COLLECTION_ID, orgId);

    if (!org || org.user.$id !== session.user.id) {
      return {
        error: "Not authorized",
      };
    }

    return action(formData, org, key);
  };
}

export function withReleaseAuth(action: any) {
  return async (
    formData: FormData | null,
    releaseId: string,
    key: string | null,
  ) => {
    const session = await getSession();

    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }

    let release;

    try {
      release = await db.get<Release>(RELEASE_COLLECTION_ID, releaseId);

      if (!release || release.user.$id !== session.user.id) {
        return {
          error: "Release not found",
        };
      }
    } catch (error: any) {
      return {
        error: "Release not found",
      };
    }

    return action(formData, release, key);
  };
}
