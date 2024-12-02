"use client";

import { useUser } from "@clerk/nextjs";
import { SignInButton, SignedIn, UserButton, SignedOut } from "@clerk/nextjs";
import { SidebarTrigger } from "./ui/sidebar";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Breadcrumbs from "./Breadcrumbs";

const Header = () => {
  const router = useRouter();
  const { user } = useUser();
  console.log(user);
  return (
    <div className="flex items-center justify-between p-4">
      {/* left side - sidebar trigger & title */}
      <div className="flex justify-center items-center">
        <SidebarTrigger className="mr-2" />
        {user && (
          <Button variant="ghost" onClick={() => router.push("/")}>
            {`${user?.firstName || user.emailAddresses}`}
            {`'s`} Space
          </Button>
        )}
      </div>

      {/* bread crumbs to show current directory */}
      <Breadcrumbs />
      {/* right side - signin controls */}
      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Header;
