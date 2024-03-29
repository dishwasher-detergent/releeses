import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { InputFile } from "node-appwrite";

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "text/plain";
  const fileBuffer = Buffer.from(await req.arrayBuffer());

  const filename = `${nanoid()}.${contentType.split("/")[1]}`;
  const newfile = await InputFile.fromBuffer(fileBuffer, filename);

  // const awFile = await storage.upload(RELEASE_BUCKET_ID, newfile);

  // const url = `${ENDPOINT}/storage/buckets/${RELEASE_BUCKET_ID}/files/${awFile.$id}/view?project=${PROJECT_ID}`;
  const url = "";

  return NextResponse.json({ url: url });
}
