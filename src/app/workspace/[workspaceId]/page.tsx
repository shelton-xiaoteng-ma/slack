"use client";

import { useGetWrokspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWrokspace({ id: workspaceId });
  return (
    <div>
      ID: {workspaceId}, {JSON.stringify(data)}
    </div>
  );
};

export default WorkspaceIdPage;
