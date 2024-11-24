import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
// icons
import { FilePlus } from "lucide-react";
import { Button } from "./ui/button";

const AppSidebar = () => {
  const menuOptions = (
    <>
      <Button className="w-full">
        {" "}
        <FilePlus /> New Document
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
