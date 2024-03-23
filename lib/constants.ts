export const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
export const ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
export const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string;
export const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID as string;

// Collections
export const ORGANIZATION_COLLECTION_ID = process.env
  .NEXT_PUBLIC_ORGANIZATION_COLLECTION_ID as string;
export const RELEASE_COLLECTION_ID = process.env
  .NEXT_PUBLIC_RELEASE_COLLECTION_ID as string;

// Buckets
export const RELEASE_BUCKET_ID = process.env
  .NEXT_PUBLIC_RELEASE_BUCKET_ID as string;

export const ORGANIZATION_BUCKET_ID = process.env
  .NEXT_PUBLIC_ORGANIZATION_BUCKET_ID as string;
