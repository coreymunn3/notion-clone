"use client";

import * as Y from "yjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { MessageSquareMore } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { FormEvent, useState, useTransition } from "react";
import BouncingLoader from "./BouncingLoader";

const ChatToDocument = ({ doc }: { doc: Y.Doc }) => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isAnswering, startTransition] = useTransition();

  const handleAskQuestion = (e: FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      // get the document text
      const documentData = doc.get("document-store").toJSON();
      // submit the question
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/chat-to-document`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentData,
            question,
          }),
        }
      );
      if (res.ok) {
        const { message } = await res.json();
        setQuestion("");
        setAnswer(message);
      } else {
        console.error(res.statusText);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MessageSquareMore /> AI Chat to Document
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat to this Document</DialogTitle>
          <DialogDescription>
            Ask a question to GPT about the contents of this document
          </DialogDescription>
        </DialogHeader>

        {(isAnswering || answer) && (
          <div className="w-full bg-slate-200 rounded-md p-4 flex gap-4 min-h-10">
            <div className="self-center">
              <p className="text-6xl">🤖</p>
            </div>
            <div className="self-end">
              {isAnswering ? <BouncingLoader /> : answer}
            </div>
          </div>
        )}

        <hr className="my-2"></hr>

        <form onSubmit={handleAskQuestion} className="flex flex-col gap-2">
          <Textarea
            placeholder="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Button
            className="w-full"
            type="submit"
            disabled={!question || isAnswering}
          >
            Ask GPT
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChatToDocument;
