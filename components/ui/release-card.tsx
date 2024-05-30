import { Badge } from "@/components/ui/badge";
import BlurImage from "@/components/ui/blur-image";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { placeholderBlurhash } from "@/lib/utils";
import { Tables } from "@/types/supabase";
import { LucideExternalLink } from "lucide-react";
import Link from "next/link";

interface ReleaseCardProps {
  data: Tables<"release">;
  org: Tables<"organization">;
  blog?: boolean;
  marketing?: boolean;
}

export default function ReleaseCard({
  data,
  org,
  blog = false,
  marketing = false,
}: ReleaseCardProps) {
  const url = `${org?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${data.slug}`;

  let link = `/release/${data.id}`;

  if (blog) {
    link = `${data.slug}`;
  }

  if (marketing) {
    link = url;
  }

  return (
    <Card className="relative flex flex-col overflow-hidden border-none p-0 shadow-none">
      <CardContent className="flex flex-1 flex-row gap-4 p-2">
        <div className="h-24 w-24 flex-none overflow-hidden  rounded-xl">
          <BlurImage
            alt={
              data.image && data.title
                ? data.title
                : "Upload your own image at /settings"
            }
            width={300}
            height={300}
            className="h-full object-cover"
            src={data.image}
            placeholder="blur"
            blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
          />
        </div>
        <div className="w-full space-y-2">
          <CardTitle className="flex flex-row justify-between truncate text-lg">
            {data.title ?? <span className="italic">No Title</span>}
            {!blog && !marketing ? (
              <Badge variant="outline">
                {data.published ? "Published" : "Draft"}
              </Badge>
            ) : null}
          </CardTitle>
          <CardDescription className="line-clamp-3 h-16">
            {data.description ?? <span className="italic">No Description</span>}
          </CardDescription>
          <div>
            {!blog && !marketing && data.published && (
              <Badge
                className="relative z-10 max-w-full px-2 py-1"
                variant="secondary"
              >
                <a
                  href={
                    process.env.NEXT_PUBLIC_VERCEL_ENV
                      ? `https://${url}`
                      : `http://${org?.subdomain}.localhost:3000/${data.slug}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full flex-row items-center gap-2 overflow-hidden"
                >
                  <span className="flex-1 truncate">{url}</span>
                  <LucideExternalLink className="size-4 flex-none" />
                </a>
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <Link href={link} className="absolute inset-0" />
    </Card>
  );
}
