import { DocumentData } from "firebase/firestore";

export interface RoomDocument extends DocumentData {
  createdAt: string;
  role: "owner" | "editor";
  roomId: string;
  userId: string;
}

export interface GroupedDocuments {
  owner: RoomDocument[];
  editor: RoomDocument[];
}