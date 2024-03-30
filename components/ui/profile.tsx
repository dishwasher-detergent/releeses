import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Skeleton } from "./skeleton";
import { ThemeToggle } from "./theme-toggle";

export default function Profile() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getUser();

      console.log(data.user);

      setUser(data.user?.user_metadata);
      setLoading(false);
    };

    userData();
  }, []);

  return !loading ? (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full flex-row items-center gap-2">
        <>
          <Avatar>
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <p className="hidden truncate text-sm font-semibold md:block">
            {user.name}
          </p>
        </>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => {
            await supabase.auth.signOut();

            router.push("/signin");
          }}
        >
          Sign Out
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ThemeToggle />
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Skeleton className="h-8 w-full" />
  );
}
