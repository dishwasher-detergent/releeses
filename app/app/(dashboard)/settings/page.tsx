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
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Form
          title="Name"
          description="Your name on this app."
          helpText="Please use 32 characters maximum."
          inputAttrs={{
            name: "name",
            type: "text",
            defaultValue: session.user?.id!,
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
            defaultValue: session.user?.email!,
            placeholder: "hello@releaser.xyz",
          }}
          handleSubmit={editUser}
        />
      </div>
    </>
  );
}
