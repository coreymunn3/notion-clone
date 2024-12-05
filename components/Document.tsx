"use client";

import { Input } from "@/components/ui/input";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useToast } from "@/hooks/use-toast";
import Editor from "./Editor";
import useOwner from "@/lib/hooks/useOwner";
import DeleteDocument from "./DeleteDocument";
import InviteUser from "./InviteUser";
import ManageUsers from "./ManageUsers";

const Document = ({ id }: { id: string }) => {
  const { toast } = useToast();
  const docRef = doc(db, "documents", id);
  const [data, loading, error] = useDocumentData(docRef);
  const [isSubmitting, startTransiton] = useTransition();
  const [input, setInput] = useState("");
  const isOwner = useOwner();

  // update the title
  useEffect(() => {
    if (data) {
      setInput(data.title);
    }
  }, [data]);

  // submit the form and update the title
  const updateTitle = async (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      try {
        startTransiton(async () => {
          await updateDoc(docRef, {
            title: input,
          });
        });
      } catch (err) {
        console.error(err);
        toast({
          title: "Unable to Update Document Title",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto pb-5 flex-1 flex flex-col">
      <div className="flex flex-row space-x-4 mb-4">
        <form
          className="flex flex-1 space-x-2 justify-center"
          onSubmit={updateTitle}
        >
          <Input value={input} onChange={(e) => setInput(e.target.value)} />
          <Button disabled={isSubmitting} type="submit">
            Update
          </Button>
        </form>
        {/* controls - invite user and delete document */}
        {isOwner && (
          <div className="space-x-2">
            <DeleteDocument docId={id} />
            <InviteUser docId={id} />
          </div>
        )}
      </div>
      {/* editable title */}

      {/* manage users, avatars */}
      <div className="flex justify-end">
        <ManageUsers docId={id} />
      </div>

      <hr className="my-4" />

      <Editor />

      {/* collaborative editor */}
    </div>
  );
};

export default Document;
