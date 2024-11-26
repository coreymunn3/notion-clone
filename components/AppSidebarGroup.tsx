import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import AppSidebarGroupOption from "./AppSidebarGroupOption";
// interfaces
import { RoomDocument } from "./interfaces/interfaces";

interface AppSidebarGroupProps {
  groupTitle: string;
  groupItems: RoomDocument[];
}

const AppSidebarGroup = ({ groupTitle, groupItems }: AppSidebarGroupProps) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{groupTitle}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {groupItems.map((doc: RoomDocument) => (
            <AppSidebarGroupOption
              key={doc.roomId}
              id={doc.roomId}
              href={`/doc/${doc.roomId}`}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default AppSidebarGroup;
