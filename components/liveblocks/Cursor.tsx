import { stringToColor } from "@/lib/utils";
import { motion } from "framer-motion";

interface CursorProps {
  x: number;
  y: number;
  info: { name: string; email: string; avatar: string };
}

const Cursor = ({ x, y, info }: CursorProps) => {
  const color = stringToColor(info.email || "1");
  return (
    <motion.div
      className="h-4 w-4 rounded-full absolute z-50"
      style={{
        left: 0,
        top: 0,
        pointerEvents: "none",
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
      initial={{
        scale: 1,
        opacity: 1,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      exit={{ scale: 0, opacity: 0 }}
    >
      <svg
        stroke={color}
        fill={color}
        strokeWidth={1}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="m13.67 6.03-11-4a.5.5 0 0 0-.64.64l4 11a.5.5 0 0 0 .935.015l1.92-4.8 4.8-1.92a.5.5 0 0 0 0-.935h-.015Z" />
      </svg>
      <motion.div
        style={{
          backgroundColor: color,
        }}
        initial={{
          scale: 0.5,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        exit={{ scale: 0.5, opacity: 0 }}
        className="px-2 py-2 bg-neutral-200 text-black font-bold whitespace-nowrap min-w-max text-xs rounded-full"
      >
        {info?.name || info.email}
      </motion.div>
    </motion.div>
  );
};

export default Cursor;
