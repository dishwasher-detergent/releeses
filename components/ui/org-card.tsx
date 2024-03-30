import { Badge } from "@/components/ui/badge";
import BlurImage from "@/components/ui/blur-image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { placeholderBlurhash } from "@/lib/utils";
import { Tables } from "@/types/supabase";
import { LucideExternalLink } from "lucide-react";
import Link from "next/link";

export default function OrgCard({ org }: { org: Tables<"organization"> }) {
  const url = `${org.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  return (
    <Card className="relative flex flex-col overflow-hidden rounded-none border-l-0 border-t-0 shadow-none">
      {/* @ts-ignore */}
      {org.release && (
        <Badge className="absolute right-2 top-2 z-10">
          {/* @ts-ignore */}
          {org.release.length} Release{org.release.length > 1 ? "s" : ""}
        </Badge>
      )}
      <CardContent className="flex-1 p-0">
        <div className="aspect-video w-full overflow-hidden">
          <BlurImage
            alt={org.image ? org.name : "Upload your own image at /settings"}
            width={500}
            height={400}
            className="h-44 object-cover"
            src={org.image}
            placeholder="blur"
            blurDataURL={org.imageBlurhash ?? placeholderBlurhash}
          />
        </div>
        <CardHeader>
          <CardTitle className="truncate text-lg">
            {org.name ?? "No Name"}
          </CardTitle>
          <CardDescription className="line-clamp-4 h-20">
            {org.description ?? "No Description"}
          </CardDescription>
        </CardHeader>
      </CardContent>
      <CardFooter>
        <Badge className="z-10 max-w-full px-2 py-1" variant="secondary">
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
      </CardFooter>
      <Link href={`/organization/${org.id}`} className="absolute inset-0" />
    </Card>
  );
}
