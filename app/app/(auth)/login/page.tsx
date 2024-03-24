import { Suspense } from "react";
import LoginButton from "./login-button";

export default function LoginPage() {
  return (
    <div className="mx-5 border border-slate-200 py-10 dark:border-slate-700 sm:mx-auto sm:w-full sm:max-w-md sm:rounded-lg sm:shadow-md">
      <h1 className="font-cal mt-6 text-center text-3xl dark:text-white">
        Platforms Starter Kit
      </h1>
      <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
        Build multi-tenant applications with custom domains. <br />
        <a
          className="font-medium text-black hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100"
          href="https://vercel.com/blog/platforms-starter-kit"
          rel="noreferrer"
          target="_blank"
        >
          Read the announcement.
        </a>
      </p>

      <div className="mx-auto mt-4 w-11/12 max-w-xs sm:w-full">
        <Suspense
          fallback={
            <div className="my-2 h-10 w-full rounded-md border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800" />
          }
        >
          <LoginButton />
        </Suspense>
      </div>
    </div>
  );
}
