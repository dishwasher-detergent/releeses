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
        <Skeleton className="h-44 rounded-none" />
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-4 w-1/2" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-full" />
          </CardDescription>
        </CardHeader>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
