import { NextResponse } from "next/server";
import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_API_KEY,
});

export async function GET(
  _req: Request,
  { params }: { params: { owner: string; repo: string } },
) {
  const owner = decodeURIComponent(params.owner);
  const repo = decodeURIComponent(params.repo);

  const response = await octokit.request("GET /repos/{owner}/{repo}/releases", {
    owner: owner,
    repo: repo,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
      "cache-control": "no-cache",
    },
  });

  console.log(response);

  return NextResponse.json(response);
}
