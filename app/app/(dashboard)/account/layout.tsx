import { ReactNode } from "react";

export default async function AccountSettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <div className="flex flex-1 flex-col overflow-y-auto">{children}</div>
    </>
  );
}
