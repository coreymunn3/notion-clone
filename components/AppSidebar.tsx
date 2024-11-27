"use client";

// hooks
import { useEffect, useState, useTransition, Fragment } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { useCollection } from "react-firebase-hooks/firestore";
import { collectionGroup, query, where } from "firebase/firestore";
import { db } from "@/firebase";
// comps
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import AppSidebarGroup from "./AppSidebarGroup";
// icons
import { FilePlus } from "lucide-react";
// actions
import { createNewDocument } from "@/actions/actions";
// interfaces
import { RoomDocument, GroupedDocuments } from "./interfaces/interfaces";

const AppSidebar = () => {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();
  const [groupedDocuments, setGroupedDocuments] = useState<GroupedDocuments>({
    owner: [],
    editor: [],
  });
  const [isPending, startTransition] = useTransition();

  /**
   * Create a New Document
   */
  const handleCreateNewDocument = () => {
    startTransition(async () => {
      // create new document
      const { docId } = await createNewDocument();
      // send toast
      toast({ title: "Created Document" });
      // change the page
      router.push(`/doc/${docId}`);
    });
  };

  /**
   * Get list of all documents for this user
   */
  const [myDocs, myDocsLoading, myDocsError] = useCollection(
    user &&
      query(
        collectionGroup(db, "rooms"),
        where("userId", "==", user.emailAddresses[0].toString())
      )
  );

  useEffect(() => {
    if (!myDocs) return;
    const newGroupedDocuments: GroupedDocuments = {
      owner: [],
      editor: [],
    };
    // separate the documents based on role
    myDocs.docs.forEach((currDoc) => {
      const currDocData = currDoc.data() as RoomDocument;
      if (currDocData.role === "owner") {
        newGroupedDocuments.owner.push({
          id: currDoc.id,
          ...currDocData,
        });
      }
      if (currDocData.role === "editor") {
        newGroupedDocuments.editor.push({
          id: currDoc.id,
          ...currDocData,
        });
      }
    });
    // set the GroupedDocuments
    setGroupedDocuments(newGroupedDocuments);
  }, [myDocs]);

  const menuOptions = (
    <>
      <div className="h-16 bg-black text-white italic flex items-center justify-center">
        Logo/Branding
      </div>
      <Button
        className="w-full"
        onClick={handleCreateNewDocument}
        disabled={isPending}
      >
        {" "}
        <FilePlus /> {isPending ? "Creating..." : "New Document"}
      </Button>

      {/* if documents are loading, show a skeleton */}
      {myDocsLoading && (
        <SidebarMenu>
          {Array.from({ length: 5 }).map((_, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuSkeleton />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      )}

      {!myDocsLoading && !myDocsError && (
        <Fragment>
          {/* my documents */}
          {groupedDocuments.owner.length > 0 && (
            <AppSidebarGroup
              groupTitle="My Documents"
              groupItems={groupedDocuments.owner}
            />
          )}

          {/* shared with me */}
          {groupedDocuments.editor.length > 0 && (
            <AppSidebarGroup
              groupTitle="Shared With Me"
              groupItems={groupedDocuments.editor}
            />
          )}
        </Fragment>
      )}
    </>
  );

  return (
    <Sidebar variant="sidebar" className="z-0">
      <SidebarContent className="p-2 md:p-4">{menuOptions}</SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
