import { Organization } from "@/interfaces/organization";
import { Release } from "@/interfaces/release";
import { Models } from "node-appwrite";

export interface User extends Models.Document {
  release: Release[];
  organization: Organization[];
  organizationCount: number;
}
