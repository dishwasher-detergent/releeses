import { ReactNode } from "react";

export default async function AccountSettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <div className="m-2 flex flex-col gap-4 overflow-y-auto rounded-xl border border-dashed border-slate-300 p-2 dark:border-slate-900 md:m-4 md:p-4">
        {children}
      </div>
    </>
  );
}
