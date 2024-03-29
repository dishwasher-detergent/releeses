import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createClient();
  const contentType = req.headers.get("content-type") || "text/plain";
  const fileBuffer = Buffer.from(await req.arrayBuffer());

  const filename = `${nanoid()}.${contentType.split("/")[1]}`;

  const { error } = await supabase.storage
    .from("release")
    .upload(filename, fileBuffer, {
      contentType: contentType,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    return NextResponse.error();
  }

  const { data } = supabase.storage.from("release").getPublicUrl(filename);

  return NextResponse.json({ url: data.publicUrl });
}
