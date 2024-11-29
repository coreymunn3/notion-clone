import { auth } from "@clerk/nextjs/server";
import RoomProvider from "@/components/liveblocks/RoomProvider";

const DocLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) => {
  auth.protect();

  const { id } = await params;

  return <RoomProvider roomId={id}>{children}</RoomProvider>;
};

export default DocLayout;
