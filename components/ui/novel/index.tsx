"use client";
import { Separator } from "@/components/ui/separator";
import "@/styles/prose.css";
import {
  EditorBubble,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorInstance,
  EditorRoot,
} from "novel";
import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import { handleImageDrop, handleImagePaste } from "novel/plugins";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { ImportRelease } from "../import-release";
import { defaultExtensions } from "./extensions";
import { uploadFn } from "./image-upload";
import { ColorSelector } from "./selectors/color-selector";
import { LinkSelector } from "./selectors/link-selector";
import { NodeSelector } from "./selectors/node-selector";
import { TextButtons } from "./selectors/text-buttons";
import { slashCommand, suggestionItems } from "./slash-command";

const extensions = [...defaultExtensions, slashCommand];

interface EditorAndRange {
  editor: EditorInstance;
  range: { from: number; to: number };
}

export default function NovelEditor({
  organization,
  repository,
  onUpdate,
  onDebouncedUpdate,
  defaultValue,
}: any) {
  const [editor, setEditor] = useState<EditorAndRange | null>(null);
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [releases, setReleases] = useState<any[]>([]);

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      onDebouncedUpdate();
    },
    500,
  );

  useEffect(() => {
    const fetchReleases = async () => {
      const res = await fetch(
        `/api/git/${organization}/${repository}/releases`,
        {
          cache: "no-store",
        },
      );

      const releasesData = await res.json();

      setReleases(releasesData.data);
    };

    fetchReleases();
  }, []);

  const parseJson = (content: string) => {
    try {
      return JSON.parse(content);
    } catch (e) {
      return content;
    }
  };

  const handleImport = (body: string) => {
    if (editor) {
      editor.editor.chain().focus().deleteRange(editor.range).run();

      editor.editor.commands.insertContentAt(editor.range.from, body, {
        updateSelection: true,
        parseOptions: {
          preserveWhitespace: "full",
        },
      });
    }
  };

  return (
    <EditorRoot>
      <EditorContent
        initialContent={parseJson(defaultValue)}
        extensions={extensions}
        className="flex-1 overflow-y-auto bg-background"
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event),
          },
          handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
          handleDrop: (view, event, _slice, moved) =>
            handleImageDrop(view, event, moved, uploadFn),
          attributes: {
            class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
          },
        }}
        onUpdate={({ editor }) => {
          onUpdate(editor);
          debouncedUpdates(editor);
        }}
        slotAfter={<ImageResizer />}
      >
        <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
          <EditorCommandEmpty className="px-2 text-muted-foreground">
            No results
          </EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                // @ts-ignore
                onCommand={(val) => item.command(val, setOpenDialog, setEditor)}
                className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                key={item.title}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>
        <EditorBubble className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl">
          <Separator orientation="vertical" />
          <NodeSelector open={openNode} onOpenChange={setOpenNode} />
          <Separator orientation="vertical" />

          <LinkSelector open={openLink} onOpenChange={setOpenLink} />
          <Separator orientation="vertical" />
          <TextButtons />
          <Separator orientation="vertical" />
          <ColorSelector open={openColor} onOpenChange={setOpenColor} />
        </EditorBubble>
        <ImportRelease
          open={openDialog}
          onOpenChange={setOpenDialog}
          releases={releases}
          handleImport={handleImport}
        />
      </EditorContent>
    </EditorRoot>
  );
}
