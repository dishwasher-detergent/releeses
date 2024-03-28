"use client";
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorInstance,
  EditorRoot,
  type JSONContent,
} from "novel";
import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import { handleImageDrop, handleImagePaste } from "novel/plugins";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { defaultExtensions } from "./extensions";
import { uploadFn } from "./image-upload";
import { slashCommand, suggestionItems } from "./slash-command";

const extensions = [...defaultExtensions, slashCommand];

export default function NovelEditor({
  onUpdate,
  onDebouncedUpdate,
  defaultValue,
}: any) {
  const [initialContent, setInitialContent] = useState<undefined | JSONContent>(
    defaultValue,
  );

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      onDebouncedUpdate();
    },
    500,
  );

  return (
    <EditorRoot>
      <EditorContent
        initialContent={initialContent}
        extensions={extensions}
        className="flex-1 overflow-y-auto bg-background p-4"
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
                onCommand={(val) => item.command(val)}
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
      </EditorContent>
    </EditorRoot>
  );
}
