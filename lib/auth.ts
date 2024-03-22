import { Organization } from "@/interfaces/organization";
import { Release } from "@/interfaces/release";
import { db } from "./appwrite";
import { ORGANIZATION_COLLECTION_ID, RELEASE_COLLECTION_ID } from "./constants";

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

export function withSiteAuth(action: any) {
  return async (
    formData: FormData | null,
    siteId: string,
    key: string | null,
  ) => {
    const session = {
      user: {
        id: "1",
      },
    };

    if (!session) {
      return {
        error: "Not authenticated",
      };
    }

    const site = await db.get<Organization>(ORGANIZATION_COLLECTION_ID, siteId);

    if (!site || site.user.$id !== session.user.id) {
      return {
        error: "Not authorized",
      };
    }

    return action(formData, site, key);
  };
}

export function withPostAuth(action: any) {
  return async (
    formData: FormData | null,
    postId: string,
    key: string | null,
  ) => {
    const session = {
      user: {
        id: "1",
      },
    };

    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }

    let post;

    try {
      post = await db.get<Release>(RELEASE_COLLECTION_ID, postId);

      if (!post || post.user.$id !== session.user.id) {
        return {
          error: "Post not found",
        };
      }
    } catch (error: any) {
      return {
        error: "Post not found",
      };
    }

    return action(formData, post, key);
  };
}
