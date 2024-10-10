import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useGetWrokspaceInfoProps {
  id: Id<"workspaces">;
}

export const useGetWrokspaceInfo = ({ id }: useGetWrokspaceInfoProps) => {
  const data = useQuery(api.workspaces.getInfoById, { id });
  const isLoading = data === null;
  return { data, isLoading };
};
