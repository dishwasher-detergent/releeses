import { findAndReplace } from "mdast-util-find-and-replace";
import Link from "next/link";
import { ReactNode } from "react";
import { visit } from "unist-util-visit";

export function replaceLinks({
  href,
  children,
}: {
  href?: string;
  children: ReactNode;
}) {
  // this is technically not a remark plugin but it
  // replaces internal links with <Link /> component
  // and external links with <a target="_blank" />
  return href?.startsWith("/") || href === "" ? (
    <Link href={href} className="cursor-pointer">
      {children}
    </Link>
  ) : (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex flex-row items-center gap-2"
    >
      {children}
    </a>
  );
}

export function replaceTweets() {
  return (tree: any) =>
    new Promise<void>(async (resolve, reject) => {
      const nodesToChange = new Array();

      visit(tree, "link", (node: any) => {
        if (
          node.url.match(
            /https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)([^\?])(\?.*)?/g,
          )
        ) {
          nodesToChange.push({
            node,
          });
        }
      });
      for (const { node } of nodesToChange) {
        try {
          const regex = /\/status\/(\d+)/gm;
          const matches = regex.exec(node.url);

          if (!matches) throw new Error(`Failed to get tweet: ${node}`);

          const id = matches[1];

          node.type = "mdxJsxFlowElement";
          node.name = "Tweet";
          node.attributes = [
            {
              type: "mdxJsxAttribute",
              name: "id",
              value: id,
            },
          ];
        } catch (e) {
          console.log("ERROR", e);
          return reject(e);
        }
      }

      resolve();
    });
}

export function remarkGithub() {
  // Regular expression to match pulls, commits, compares, and user profiles
  const regex = /https:\/\/github\.com\/[\S]*/g;

  // @ts-ignore
  return (tree, _file) => {
    // @ts-ignore
    findAndReplace(tree, [[regex, replaceMention]]);
  };

  function replaceMention(value: string) {
    const id = getVal(value);
    const url = new URL(value);

    let message = "";
    if (value.includes("/pull/")) {
      message = `#${id}`;
    } else if (value.includes("/commit/")) {
      message = `${id.slice(0, 7)}`;
    } else if (value.includes("/compare/")) {
      message = `${id}`;
    } else if (url.pathname.split("/").length === 2) {
      message = `@${id}`;
    } else {
      message = value;
    }

    return [
      {
        type: "text",
        value: message,
      },
    ];
  }
}

export function remarkGitlab() {
  // Regular expression to match pulls, commits, compares, and user profiles
  const regex = /https:\/\/gitlab\.com\/[\S]*/g;
  // @ts-ignore
  return (tree, _file) => {
    // @ts-ignore
    findAndReplace(tree, [[regex, replaceMention]]);
  };

  function replaceMention(value: string) {
    const id = getVal(value);
    const url = new URL(value);

    let message = "";
    if (value.includes("/merge_requests/")) {
      message = `#${id}`;
    } else if (value.includes("/commit/")) {
      message = `${id.slice(0, 7)}`;
    } else if (value.includes("/compare/")) {
      message = `${id}`;
    } else if (url.pathname.split("/").length === 2) {
      message = `@${id}`;
    } else {
      message = value;
    }

    return [
      {
        type: "text",
        value: message,
      },
    ];
  }
}

export function remarkBitbucket() {
  // Regular expression to match pulls, commits, compares, and user profiles
  const regex = /https:\/\/bitbucket\.com\/[\S]*/g;
  // @ts-ignore
  return (tree, _file) => {
    // @ts-ignore
    findAndReplace(tree, [[regex, replaceMention]]);
  };

  function replaceMention(value: string) {
    const id = getVal(value);
    const url = new URL(value);

    let message = "";
    if (value.includes("/pull-requests/")) {
      message = `#${id}`;
    } else if (value.includes("/commits/")) {
      message = `${id.slice(0, 7)}`;
    }

    return [
      {
        type: "text",
        value: message,
      },
    ];
  }
}

function getVal(value: string) {
  const parts = value.split("/");
  return parts[parts.length - 1];
}
