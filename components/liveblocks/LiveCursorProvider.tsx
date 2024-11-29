"use client";

import { useMyPresence, useOthers } from "@liveblocks/react";
import { PointerEvent, useRef } from "react";
import Cursor from "./Cursor";

const LiveCursorProvider = ({ children }: { children: React.ReactNode }) => {
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();
  const positionRef = useRef<HTMLDivElement>(null);

  // update my cursor presence
  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (positionRef.current) {
      const rect = positionRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cursor = { x, y };
      updateMyPresence({ cursor });
    }
  };

  // when I leave, remove my cursor
  const handlePointerLeave = (e: PointerEvent<HTMLDivElement>) => {
    updateMyPresence({ cursor: null });
  };

  return (
    <div
      className="relative"
      ref={positionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {others
        .filter((other) => other.presence.cursor !== null)
        .map(({ connectionId, presence, info }) => (
          <Cursor
            key={connectionId}
            info={info}
            x={presence.cursor!.x}
            y={presence.cursor!.y}
          />
        ))}
      {children}
    </div>
  );
};

export default LiveCursorProvider;
