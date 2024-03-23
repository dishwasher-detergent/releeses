"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="rounded-lg p-1.5 text-slate-700 transition-all duration-150 ease-in-out hover:bg-slate-200 active:bg-slate-300 dark:text-white dark:hover:bg-slate-700 dark:active:bg-slate-800"
    >
      <LogOut width={18} />
    </button>
  );
}
