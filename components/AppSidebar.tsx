"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
// icons
import { FilePlus } from "lucide-react";
// actions
import { createNewDocument } from "@/actions/actions";

const AppSidebar = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleCreateNewDocument = () => {
    startTransition(async () => {
      // create new document
      const { docId } = await createNewDocument();
      router.push(`/doc/${docId}`);
    });
  };

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
      <SidebarGroup>
        <SidebarGroupLabel>My Documents</SidebarGroupLabel>
        {/* <SidebarGroupContent></SidebarGroupContent> */}
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Shared With Me</SidebarGroupLabel>
        {/* <SidebarGroupContent></SidebarGroupContent> */}
      </SidebarGroup>
    </>
  );

  return (
    <Sidebar variant="sidebar" className="z-0">
      <SidebarContent className="p-4 mt-2">{menuOptions}</SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
