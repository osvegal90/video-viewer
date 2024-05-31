import { create } from "zustand";
import Content from "./entities/Content";

interface ContentStore {
  content: Content;
  setContent: (content: Content) => void;
}

const useContentStore = create<ContentStore>((set) => ({
  content: {
    activeSection: undefined,
    activeContent: undefined,
    activeSrc: undefined,
    nextSection: undefined,
    nextContent: undefined,
    nextSrc: undefined,
    previousSection: undefined,
    previousContent: undefined,
    previousSrc: undefined,
  },
  setContent: (updatedContent: Content) =>
    set((store) => ({ content: { ...store.content, ...updatedContent } })),
}));

export default useContentStore;
