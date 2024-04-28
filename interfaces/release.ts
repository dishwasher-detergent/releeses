import { Organization } from "@/interfaces/organization";
import { Json } from "@/types/supabase";

export interface Release {
  content: string | null;
  contentJson: Json | null;
  created_at: string;
  description: string | null;
  id: number;
  image: string | null;
  imageBlurhash: string | null;
  organizationId: number | null;
  published: boolean | null;
  slug: string | null;
  title: string | null;
  user_id: string | null;
  organization: Organization;
}
