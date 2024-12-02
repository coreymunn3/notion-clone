"use client";

import { UserRoundPlus } from "lucide-react";
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
import { FormEvent, useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { inviteUserToDocument } from "@/actions/actions";
import { Input } from "./ui/input";

const InviteUser = ({ docId }: { docId: string }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [isInviting, startTransiton] = useTransition();

  const handleInvite = async (e: FormEvent) => {
    e.preventDefault();

    try {
      startTransiton(async () => {
        const { success } = await inviteUserToDocument(docId, email);
      });
      setEmail("");
      setOpen(false);
      toast({
        title: `Added ${email} as an Editor!`,
        variant: "default",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to Invite User",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <UserRoundPlus /> Invite
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a User to Collaborate!</DialogTitle>
          <DialogDescription>
            Enter the email of the user you want to invite.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleInvite} className="flex space-x-2">
          <Input
            type="email"
            placeholder="Email"
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" disabled={isInviting}>
            Invite
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUser;
