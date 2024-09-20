import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useGetWrokspaceProps {
  id: Id<"workspaces">;
}

export const useGetWrokspace = ({id}: useGetWrokspaceProps) => {
  const data = useQuery(api.workspaces.getById, {id});
  const isLoading = data === null;
  return { data, isLoading };
};
