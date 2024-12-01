"use client";

import { useSelf } from "@liveblocks/react/suspense";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { BlockNoteEditor } from "@blocknote/core";
import * as Y from "yjs";
import { stringToColor } from "@/lib/utils";

type EditorProps = {
  doc: Y.Doc;
  provider: any;
  darkMode: boolean;
};

function BlockNote({ doc, provider, darkMode }: EditorProps) {
  const userInfo = useSelf((me) => me.info);
  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      // Where to store BlockNote data in the Y.Doc:
      fragment: doc.getXmlFragment("document-store"),
      // Information for this user:
      user: {
        name: userInfo.name,
        color: "#ff0b0b",
      },
    },
  });

  return (
    <BlockNoteView
      className="flex-1"
      editor={editor}
      theme={darkMode ? "dark" : "light"}
    />
  );
}

export default BlockNote;
