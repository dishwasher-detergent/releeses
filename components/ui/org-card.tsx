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
import { Organization } from "@/interfaces/organization";
import { placeholderBlurhash } from "@/lib/utils";
import { LucideExternalLink } from "lucide-react";
import Link from "next/link";

export default function OrgCard({ data }: { data: Organization }) {
  const url = `${data.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  return (
    <Card className="relative flex flex-col overflow-hidden rounded-none border-l-0 border-t-0 shadow-none">
      <CardContent className="flex-1 p-0">
        <BlurImage
          alt={data.name ?? "Card thumbnail"}
          width={500}
          height={400}
          className="h-44 object-cover"
          src={data.image ?? "/placeholder.png"}
          placeholder="blur"
          blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
        />
        <CardHeader>
          <CardTitle className="h-4 truncate">
            {data.name ?? "No Name"}
          </CardTitle>
          <CardDescription className="line-clamp-4 h-20">
            {data.description ?? "No Description"}
          </CardDescription>
        </CardHeader>
      </CardContent>
      <CardFooter>
        <Badge className="z-10 max-w-full px-2 py-1" variant="secondary">
          <a
            href={
              process.env.NEXT_PUBLIC_VERCEL_ENV
                ? `https://${url}`
                : `http://${data.subdomain}.localhost:3000`
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
      <Link href={`/organization/${data.$id}`} className="absolute inset-0" />
    </Card>
  );
}
