"use client";

// hooks
import { useEffect, useState, useTransition, Fragment } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  collectionGroup,
  DocumentData,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
// comps
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
// icons
import { FilePlus } from "lucide-react";
// actions
import { createNewDocument } from "@/actions/actions";

interface RoomDocument extends DocumentData {
  createdAt: string;
  role: "owner" | "editor";
  roomId: string;
  userId: string;
}

interface GroupedDocuments {
  owner: RoomDocument[];
  editor: RoomDocument[];
}

const AppSidebar = () => {
  const router = useRouter();
  const { user } = useUser();
  const [groupedDocuments, setGroupedDocuments] = useState<GroupedDocuments>({
    owner: [],
    editor: [],
  });
  console.log(groupedDocuments);
  const [isPending, startTransition] = useTransition();

  /**
   * Create a New Document
   */
  const handleCreateNewDocument = () => {
    startTransition(async () => {
      // create new document
      const { docId } = await createNewDocument();
      router.push(`/doc/${docId}`);
    });
  };

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
      <Button
        className="w-full"
        onClick={handleCreateNewDocument}
        disabled={isPending}
      >
        {" "}
        <FilePlus /> {isPending ? "Creating..." : "New Document"}
      </Button>

      {/* if documents are loading */}
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
            <SidebarGroup>
              <SidebarGroupLabel>My Documents</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {groupedDocuments.owner.map((doc) => (
                    <SidebarMenuItem key={doc.roomId}>
                      <SidebarMenuButton variant={"outline"}>
                        {doc.roomId}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* shared with me */}
          {groupedDocuments.editor.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel>Shared With Me</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {groupedDocuments.editor.map((doc) => (
                    <SidebarMenuItem key={doc.roomId}>
                      <SidebarMenuButton variant={"outline"}>
                        {doc.roomId}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </Fragment>
      )}
    </>
  );

  return (
    <Sidebar variant="sidebar" className="z-0">
      <SidebarContent className="p-4 mt-2">{menuOptions}</SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
