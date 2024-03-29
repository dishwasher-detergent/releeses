import Form from "@/components/form";
import { Separator } from "@/components/ui/separator";
import { editUser } from "@/lib/actions";
import { getSession } from "@/lib/auth";

export default async function SettingsPage() {
  const { data: user } = await getSession();

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
            defaultValue: user.user?.id!,
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
            defaultValue: user.user?.email!,
            placeholder: "hello@releaser.xyz",
          }}
          handleSubmit={editUser}
        />
      </div>
    </>
  );
}
