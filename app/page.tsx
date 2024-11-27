import { ArrowLeftCircleIcon } from "lucide-react";

export default function Home() {
  return (
    <main className="flex space-x-2 items-center animate-pulse p-4">
      <ArrowLeftCircleIcon className="w-12 h-12" />
      <h1>Get started by creating a new Document!</h1>
    </main>
  );
}
