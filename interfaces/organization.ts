export interface Organization {
  created_at: string;
  customDomain: string | null;
  description: string | null;
  font: string;
  id: number;
  image: string | null;
  imageBlurhash: string | null;
  logo: string | null;
  message404: string | null;
  name: string;
  subdomain: string;
  user_id: string | null;
}
