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

export default function OrgCard({ org }: { org: Tables<"organization"> }) {
  const url = `${org.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  return (
    <Card className="relative flex flex-col overflow-hidden shadow-none">
      <CardContent className="flex flex-1 flex-row gap-4 p-2">
        <div className="h-24 w-24 flex-none overflow-hidden  rounded-xl">
          <BlurImage
            alt={org.image ? org.name : "Upload your own image at /settings"}
            width={300}
            height={300}
            className="h-full object-cover"
            src={org.image}
            placeholder="blur"
            blurDataURL={org.imageBlurhash ?? placeholderBlurhash}
          />
        </div>
        <div className="w-full space-y-2">
          <CardTitle className="flex flex-row justify-between truncate text-lg">
            {org.name ?? <span className="italic">No Title</span>}
            {/* @ts-ignore */}
            {org.release && (
              <Badge variant="outline">
                {/* @ts-ignore */}
                {org.release.length} Release{org.release.length > 1 ? "s" : ""}
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="line-clamp-3 h-16">
            {org.description ?? <span className="italic">No Description</span>}
          </CardDescription>
          <div>
            <Badge
              className="relative z-10 max-w-full px-2 py-1"
              variant="secondary"
            >
              <a
                href={
                  process.env.NEXT_PUBLIC_VERCEL_ENV
                    ? `https://${url}`
                    : `http://${org.subdomain}.localhost:3000`
                }
                target="_blank"
                rel="noreferrer"
                className="flex w-full flex-row items-center gap-2 overflow-hidden"
              >
                <span className="flex-1 truncate">{url}</span>
                <LucideExternalLink className="size-4 flex-none" />
              </a>
            </Badge>
          </div>
        </div>
      </CardContent>
      <Link href={`/organization/${org.id}`} className="absolute inset-0" />
    </Card>
  );
}
