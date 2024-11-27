"use client";
import { useParams } from "next/navigation";
import Document from "@/components/Document";

const DocumentPage = () => {
  const params = useParams<{ id: string }>();
  const { id } = params;

  if (id) {
    return (
      <div className="flex flex-col flex-1 w-full min-h-screen">
        <Document id={id} />
      </div>
    );
  }
};

export default DocumentPage;
