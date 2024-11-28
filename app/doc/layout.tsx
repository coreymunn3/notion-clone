import LiveBlocksProvider from "@/components/liveblocks/LiveBlocksProvider";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return <LiveBlocksProvider>{children}</LiveBlocksProvider>;
};

export default PageLayout;
