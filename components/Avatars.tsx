"use client";
import { useOthers, useSelf } from "@liveblocks/react/suspense";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Avatars = () => {
  const users = useOthers();
  const currentUser = useSelf();

  const allUsers = [currentUser, ...users];

  return (
    <div className="flex -space-x-4">
      {allUsers.map((user, i) => (
        <TooltipProvider key={user.id + i}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="border-2 hover:z-50">
                <AvatarImage src={user.info.avatar} />
                <AvatarFallback>
                  {user.info.name?.toString()?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{currentUser.id === user.id ? "You" : user.info.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default Avatars;
