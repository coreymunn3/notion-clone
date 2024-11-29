import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import liveblocks from "@/lib/liveblocks";
import { adminDb } from "@/firebase-admin";

/**
 * Most of this code taken from https://liveblocks.io/docs/authentication/access-token/nextjs
 */
export async function POST(req: NextRequest) {
  auth.protect();

  const { sessionClaims } = await auth();
  const { room } = await req.json();

  const session = liveblocks.prepareSession(sessionClaims?.email!, {
    userInfo: {
      name: sessionClaims?.fullName!,
      email: sessionClaims?.email!,
      avatar: sessionClaims?.image!,
    },
  });

  // get a list of rooms that user ID has access to
  const roomsForUser = await adminDb
    .collectionGroup("rooms")
    .where("userId", "==", sessionClaims?.email!)
    .get();
  // find out if this user is in that list
  const userInRoom = roomsForUser.docs.find((doc) => doc.id === room);
  // if user can access the room, authorize in liveblocks; otherwise deny
  if (userInRoom) {
    session.allow(room, session.FULL_ACCESS);
    const { status, body } = await session.authorize();
    return new Response(body, { status });
  } else {
    return NextResponse.json(
      { message: "You are not authorized for this room" },
      { status: 403 }
    );
  }
}
