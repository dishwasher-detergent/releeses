import Form from "@/components/form";
import { Separator } from "@/components/ui/separator";
import { editUser } from "@/lib/actions";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return (
    <>
      <div className="flex h-[52px] items-center justify-between px-4 py-2">
        <h1 className="text-xl font-bold">Settings</h1>
      </div>
      <Separator />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Form
          title="Name"
          description="Your name on this app."
          helpText="Please use 32 characters maximum."
          inputAttrs={{
            name: "name",
            type: "text",
            defaultValue: session.user.name!,
            placeholder: "John Doe",
            maxLength: 32,
          }}
          handleSubmit={editUser}
        />
        <Separator />
        <Form
          title="Email"
          description="Your email on this app."
          helpText="Please enter a valid email."
          inputAttrs={{
            name: "email",
            type: "email",
            defaultValue: session.user.email!,
            placeholder: "hello@releaser.xyz",
          }}
          handleSubmit={editUser}
        />
      </div>
    </>
  );
}
