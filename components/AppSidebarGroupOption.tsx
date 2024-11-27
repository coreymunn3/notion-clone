import { useDocumentData } from "react-firebase-hooks/firestore";
import { SidebarMenuItem, SidebarMenuButton } from "./ui/sidebar";
import Link from "next/link";
import { db } from "@/firebase";
import { doc } from "firebase/firestore";
import { usePathname } from "next/navigation";

const AppSidebarGroupOption = ({ href, id }: { href: string; id: string }) => {
  // get the document data
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));
  // figure out if link should be active
  const pathname = usePathname();
  const isActivePage = href.includes(pathname) && pathname !== "/";

  const defaultClass = "hover:bg-gray-100 hover:border hover:border-gray-300";

  if (data && !loading) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          variant={"outline"}
          className={
            isActivePage
              ? `bg-gray-100 border border-gray-300 ${defaultClass}`
              : defaultClass
          }
          asChild
        >
          <Link href={href}>
            <p className="truncate">{data.title}</p>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }
};

export default AppSidebarGroupOption;
