"use client";
import { UserButton } from "@/features/auth/components/user-button";
import { useGetWrokspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWrokspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function Home() {
  const router = useRouter();
  const [open, setOpen] = useCreateWrokspaceModal();

  const { data, isLoading } = useGetWrokspaces();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) {
      console.log("loading");
      return;
    }

    if (workspaceId) {
      setOpen(false);
      console.log("Redirect to workspace");
      router.replace(`/workspace/${workspaceId}`);
    } else {
      setOpen(true);
      console.log("Open creation modal");
    }
  }, [workspaceId, isLoading, open, setOpen, router]);
  return (
    <div>
      <UserButton />
    </div>
  );
}
