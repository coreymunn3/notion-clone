"use client";

import { useUser } from "@clerk/nextjs";
import { SignInButton, SignedIn, UserButton, SignedOut } from "@clerk/nextjs";
import { SidebarTrigger } from "./ui/sidebar";

const Header = () => {
  const { user } = useUser();
  return (
    <div className="flex items-center justify-between p-4">
      {/* left side - sidebar trigger & title */}
      <div className="flex justify-center items-center">
        <SidebarTrigger className="mr-2" />
        {user && (
          <h1>
            {user.firstName}
            {`'s`} Space
          </h1>
        )}
      </div>

      {/* bread crumbs to show current directory */}

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
