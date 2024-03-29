import { createClient } from "@/lib/supabase/server";

export async function getSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  return data;
}

export function withOrgAuth(action: any) {
  return async (
    formData: FormData | null,
    orgId: string,
    key: string | null,
  ) => {
    const session = await getSession();
    const supabase = createClient();

    if (!session) {
      return {
        error: "Not authenticated",
      };
    }

    const { data, error } = await supabase
      .from("organization")
      .select()
      .eq("id", orgId)
      .single();

    if (!data || data.user_id !== session.user?.id) {
      return {
        error: "Not authorized",
      };
    }

    return action(formData, data, key);
  };
}

export function withReleaseAuth(action: any) {
  return async (
    formData: FormData | null,
    releaseId: number,
    key: string | null,
  ) => {
    const session = await getSession();
    const supabase = createClient();

    if (!session.user?.id) {
      return {
        error: "Not authenticated",
      };
    }

    const { data, error } = await supabase
      .from("release")
      .select()
      .eq("id", releaseId)
      .single();

    if (!data || data.user_id !== session.user?.id) {
      return {
        error: "Not authorized",
      };
    }

    return action(formData, data, key);
  };
}
