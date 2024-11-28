import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stringToColor(str: string){
  // Simple hash function (FNV-1a hash)
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(hash ^ str.charCodeAt(i), 0x5f356495);
  }
  
  // Ensure the hash is positive
  hash = Math.abs(hash);
  
  // Extract RGB components from the hash
  const r = (hash >> 16) & 0xff; // Extract the red component
  const g = (hash >> 8) & 0xff;  // Extract the green component
  const b = hash & 0xff;         // Extract the blue component

  // Convert RGB to Hex and return as a color code string
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}
