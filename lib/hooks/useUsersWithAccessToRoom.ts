import { useCollection } from "react-firebase-hooks/firestore";
import { collectionGroup, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useRoom } from "@liveblocks/react";
import { useUser } from "@clerk/nextjs";

const useUsersWithAccessToRoom = () => {
  const room = useRoom();
  const user = useUser();

  // get list of all users in this room
  const [usersInRoom, loading, error] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
  );

  if (error) {
    throw new Error("Could not get users in room");
  }

  if (!loading && !error) {
    return usersInRoom;
  }
};

export default useUsersWithAccessToRoom;
