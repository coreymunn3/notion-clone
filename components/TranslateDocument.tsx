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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import BouncingLoader from "./BouncingLoader";
import { Languages, Bot } from "lucide-react";
import { FormEvent, useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";

const languages: string[] = [
  "english",
  "spanish",
  "portuguese",
  "french",
  "german",
  "chinese",
  "arabic",
  "hindi",
  "russian",
  "japanese",
];

const TranslateDocument = ({ doc }: { doc: Y.Doc }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState(languages[0]);
  const [targetLanguage, setTargetLanguage] = useState(languages[0]);
  const [summary, setSummary] = useState();
  const [question, setQuestion] = useState(languages[0]);
  const [isTranslating, startTransition] = useTransition();

  const handleTranslate = (e: FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      // get the document text
      const documentData = doc.get("document-store").toJSON();
      // get the translation and summary
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/translate-document`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentData,
            sourceLanguage,
            targetLanguage,
          }),
        }
      );
      if (res.ok) {
        const { text } = await res.json();
        setSummary(text.translated_text);
        toast({
          title: "Your document has been summarized & translated!",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Languages /> Translate
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Summarize & Translate</DialogTitle>
          <DialogDescription>
            Choose what language you would like the summary to be translated to
          </DialogDescription>
        </DialogHeader>

        {(isTranslating || summary) && (
          <div className="w-full bg-slate-200 rounded-md p-4 flex gap-4 min-h-10">
            <div className="self-center">
              <p className="text-6xl">🤖</p>
            </div>
            <div className="self-end">
              {isTranslating ? <BouncingLoader /> : summary}
            </div>
          </div>
        )}

        <hr className="my-2"></hr>

        <form onSubmit={handleTranslate}>
          <div className="flex gap-2 mb-4">
            <div className="flex flex-1 flex-col">
              <div className="text-gray-400 text-sm mb-1">Source Language</div>
              {/* source language - always english (for now) */}
              <Select
                value={sourceLanguage}
                onValueChange={(val) => setSourceLanguage(val)}
              >
                <SelectTrigger disabled={true}>
                  <SelectValue defaultValue={"english"} />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* destination language ( select ) */}
            <div className="flex flex-1 flex-col">
              <div className="font-light text-sm mb-1">Translate To</div>
              <Select
                value={targetLanguage}
                onValueChange={(val) => setTargetLanguage(val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            className="w-full"
            type="submit"
            disabled={!targetLanguage || isTranslating}
          >
            {isTranslating ? "Translating..." : "Translate"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TranslateDocument;
