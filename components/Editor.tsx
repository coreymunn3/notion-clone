"use client";

import { useEffect, useState } from "react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useRoom } from "@liveblocks/react/suspense";
import BlockNote from "./BlockNote";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

const Editor = () => {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  console.log(doc);
  const [provider, setProvider] = useState<any>();
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Set up Liveblocks Yjs provider
  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
    };
  }, [room]);

  // toggle dark mode
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (!doc || !provider) {
    return null;
  }

  return (
    <div className="w-full flex-1 flex flex-col">
      <div className="flex items-center gap-2 justify-end mb-8">
        {/* CONTROLS: Translate AI, chat to document AI */}
        <div></div>
        {/* dark mode */}
        <div>
          <Button
            className={
              darkMode
                ? "text-gray-200 bg-gray-700 hover:bg-gray-500 hover:text-gray-200"
                : "text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
            }
            onClick={handleToggleDarkMode}
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </Button>
        </div>
      </div>
      {/* block note editor */}
      <BlockNote doc={doc} provider={provider} darkMode={darkMode} />
    </div>
  );
};

export default Editor;
