import { useUser } from "@clerk/nextjs";
import { useRoom } from "@liveblocks/react";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "@/firebase";
import { collectionGroup, query, where } from "firebase/firestore";
import useUsersWithAccessToRoom from "./useUsersWithAccessToRoom";

const useOwner = () => {
  const { user } = useUser();
  const room = useRoom();
  const [isOwner, setIsOwner] = useState(false);
  const usersWithAccess = useUsersWithAccessToRoom();

  // whenever our users in the room or the logged in user change
  // find which of the users is the owner of this document
  // and figure out if that owner is the same as the current logged in user
  useEffect(() => {
    if (usersWithAccess?.docs.length) {
      const owners = usersWithAccess.docs.filter(
        (doc) => doc.data().role == "owner"
      );
      const thisUserIsOwner = owners.some(
        (ownerDoc) =>
          ownerDoc.data().userId == user?.emailAddresses[0].toString()
      );
      if (thisUserIsOwner) setIsOwner(true);
    }
  }, [usersWithAccess, user]);

  return isOwner;
};

export default useOwner;
