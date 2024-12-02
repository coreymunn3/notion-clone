"use client";

import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { deleteDocument } from "@/actions/actions";

const DeleteDocument = ({ docId }: { docId: string }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, startTransiton] = useTransition();

  const handleDeleteDocument = async () => {
    try {
      startTransiton(async () => {
        const { success } = await deleteDocument(docId);
        if (success) {
          setOpen(false);
          toast({
            title: "Successfully deleted",
            variant: "default",
          });
        }
      });
      // push user to home page
      router.push("/");
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to delete the document",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"destructive"} disabled={isDeleting}>
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to Delete?</DialogTitle>
          <DialogDescription>
            This will delete the document and all of its contents, remove all
            users from the document. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4">
          <Button variant={"secondary"} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDeleteDocument} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDocument;
