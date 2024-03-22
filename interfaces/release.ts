import { Models } from "node-appwrite";
import { Organization } from "./organization";
import { User } from "./user";

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
