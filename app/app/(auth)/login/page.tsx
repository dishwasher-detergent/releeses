import { Suspense } from "react";
import LoginButton from "./login-button";

export default function LoginPage() {
  return (
    <div className="mx-auto mt-4 w-11/12 max-w-xs sm:w-full">
      <Suspense
        fallback={
          <div className="my-2 h-10 w-full rounded-md border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800" />
        }
      >
        <LoginButton />
      </Suspense>
    </div>
  );
}
