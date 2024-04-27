import { ReactNode } from "react";

export default async function AccountSettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <div className="m-4 flex flex-col gap-4 overflow-y-auto rounded-xl border border-dashed border-slate-300 p-4">
        {children}
      </div>
    </>
  );
}
