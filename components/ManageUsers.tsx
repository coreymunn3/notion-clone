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
import { useState, useTransition } from "react";
import { useRoom } from "@liveblocks/react";
import { useUser } from "@clerk/nextjs";
import useOwner from "@/lib/hooks/useOwner";
import { Trash2, KeyRound } from "lucide-react";
import useUsersWithAccessToRoom from "@/lib/hooks/useUsersWithAccessToRoom";
import { useToast } from "@/hooks/use-toast";
import { removeUserFromDocument } from "@/actions/actions";

const ManageUsers = ({ docId }: { docId: string }) => {
  const { toast } = useToast();
  const usersWithAccess = useUsersWithAccessToRoom();
  const { user } = useUser();
  const isOwner = useOwner();
  const [open, setOpen] = useState(false);
  const [isDeleting, startTransiton] = useTransition();

  const handleDeleteUserFromDoc = async (userId: string) => {
    if (!userId) return;
    try {
      startTransiton(async () => {
        const { success } = await removeUserFromDocument(docId, userId);
        if (success) {
          toast({
            title: `Removed user ${userId} from this document`,
            variant: "default",
          });
        }
      });
    } catch (error) {
      toast({
        title: "Failed to remove user from this document",
        variant: "default",
      });
    }
  };

  if (usersWithAccess) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button variant={"outline"}>
            <KeyRound></KeyRound>
            {`User Permissions (${usersWithAccess?.docs.length})`}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Users with access</DialogTitle>
            <DialogDescription>
              Below is a list of users that have access to this documents
            </DialogDescription>
          </DialogHeader>

          <hr className="my-2"></hr>

          {/* users in the room */}
          <div>
            {usersWithAccess.docs.map((doc) => {
              const isCurrentUser =
                doc.data().userId === user?.emailAddresses[0].toString();

              return (
                <div
                  key={doc.data().userId}
                  className="flex items-center justify-between mb-2"
                >
                  {isCurrentUser ? (
                    <p className="font-semibold w-60 text-ellipsis overflow-hidden">{`You(${
                      doc.data().userId
                    })`}</p>
                  ) : (
                    <p className="font-light  w-60 text-ellipsis overflow-hidden">
                      {doc.data().userId}
                    </p>
                  )}

                  <div className="flex items-center gap-2 w-40">
                    <Button variant={"outline"}>{doc.data().role}</Button>
                    {isOwner && !isCurrentUser && (
                      <Button
                        variant={"destructive"}
                        size="sm"
                        disabled={isDeleting}
                        onClick={() =>
                          handleDeleteUserFromDoc(doc.data().userId)
                        }
                      >
                        <Trash2></Trash2>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
};

export default ManageUsers;
