import { atom, useAtom } from "jotai";

const modalState = atom(false);

export const useCreateWrokspaceModal = () => {
  return useAtom(modalState);
};
