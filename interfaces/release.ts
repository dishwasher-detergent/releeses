import { Organization } from "@/interfaces/organization";
import { User } from "@/interfaces/user";
import { Models } from "node-appwrite";

export interface Release extends Models.Document {
  user: User;
  userId: string;
  organization: Organization;
  organizationId: string;
  title: string;
  description: string;
  content: string;
  image: string;
  imageBlurhash: string;
  published: boolean;
  slug: string;
}
