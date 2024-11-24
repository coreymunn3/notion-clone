'use server'

import { adminDb } from "@/firebase-admin"
import { auth } from "@clerk/nextjs/server"

export async function createNewDocument(){
  auth.protect()
  const {sessionClaims} = await auth()

  // create a new document
  const docCollectionRef = adminDb.collection('documents')
  const docRef = await docCollectionRef.add({
    title: 'New Doc'
  })

  // add the user to the room
  await adminDb.collection('users').doc(sessionClaims?.email!).collection('rooms').doc(docRef.id).set({
    userId: sessionClaims?.email!,
    role: 'owner',
    createdAt: new Date(),
    roomId: docRef.id
  })

  return {docId: docRef.id}
}