import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const useGetWrokspaces = () => {
  const data = useQuery(api.workspaces.get);
  const isLoading = data === null;
  return { data, isLoading };
};
