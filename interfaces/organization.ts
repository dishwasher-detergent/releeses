import { User } from "@/interfaces/user";
import { Models } from "node-appwrite";
import { Release } from "./release";

export interface Organization extends Models.Document {
  name: string;
  description: string;
  subdomain: string;
  customDomain: string;
  font: string;
  logo: string;
  image: string;
  imageBlurhash: string;
  message404: string;
  user: User;
  userId: string;
  release: Release[];
}
