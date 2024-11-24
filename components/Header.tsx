"use client";

import { useUser } from "@clerk/nextjs";
import { SignInButton, SignedIn, UserButton, SignedOut } from "@clerk/nextjs";

const Header = () => {
  const { user } = useUser();
  return (
    <div className="flex items-center justify-between p-4">
      {user && (
        <h1>
          {user.firstName}
          {`'s`} Space
        </h1>
      )}
      {/* bread crumbs to show current directory */}
      {/* nav controls for sign in */}
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
