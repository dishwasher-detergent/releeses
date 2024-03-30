import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingCard() {
  return (
    <Card className="relative flex flex-col overflow-hidden rounded-none border-l-0 border-t-0 shadow-none">
      <CardContent className="flex-1 p-0">
        <Skeleton className="aspect-[2/1] w-full rounded-none" />
        <CardHeader>
          <CardTitle className="h-4 truncate">
            <Skeleton className="h-4 w-1/2" />
          </CardTitle>
          <CardDescription className="h-20">
            <Skeleton className="h-full w-full" />
          </CardDescription>
        </CardHeader>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
