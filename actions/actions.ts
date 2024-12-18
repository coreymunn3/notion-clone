"use server";

import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { WriteResult } from "firebase-admin/firestore";

export async function createNewDocument() {
  auth.protect();
  const { sessionClaims } = await auth();

  // create a new document
  const docCollectionRef = adminDb.collection("documents");
  const docRef = await docCollectionRef.add({
    title: "New Doc",
  });

  // add the user to the room
  await adminDb
    .collection("users")
    .doc(sessionClaims?.email!)
    .collection("rooms")
    .doc(docRef.id)
    .set({
      userId: sessionClaims?.email!,
      role: "owner",
      createdAt: new Date(),
      roomId: docRef.id,
    });

  return { docId: docRef.id };
}

export const deleteDocument = async (
  docId: string
): Promise<{ success: boolean }> => {
  auth.protect();
  if (!docId) return { success: false };

  // must delete in 2 places - in the document collection, and in every user room group
  try {
    // delete the document
    await adminDb.collection("documents").doc(docId).delete();
    console.log(`Deleted document ${docId}`);

    // delete in all user rooms that match this doc ID
    const roomsSnapshot = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", docId)
      .get();

    const deletes: Promise<WriteResult>[] = [];
    roomsSnapshot.forEach((doc) => {
      deletes.push(doc.ref.delete());
    });
    // wait for all docs to finish getting deleted
    await Promise.all(deletes);

    // delete the room in liveblocks
    await liveblocks.deleteRoom(docId);

    // if we get here, the operation was a success
    return { success: true };
  } catch (error) {
    console.error(error);
    console.error(error);
    return { success: false };
  }
};

export const inviteUserToDocument = async (
  docId: string,
  email: string
): Promise<{ success: boolean }> => {
  auth.protect();

  try {
    // create a room for this user where they are the editor
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(docId)
      .set({
        userId: email,
        role: "editor",
        createdAt: new Date(),
        roomId: docId,
      });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};

export const removeUserFromDocument = async (
  docId: string,
  userId: string
): Promise<{ success: boolean }> => {
  auth.protect();
  // to avoid confusion: The userId that we created is actually the session claims email address.
  // the term userId is a bit confusing here, so when we use it to filter users later, remember that this is actually an email address
  const userEmail = userId;

  try {
    // delete the document from the user's rooms
    await adminDb
      .collection("users")
      .doc(userEmail)
      .collection("rooms")
      .doc(docId)
      .delete();
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};
