import { create } from "zustand";

interface Content {
  activeSection: string | undefined;
  activeContent: string | undefined;
  activeSrc: string | undefined;
  nextSection: string | undefined;
  nextContent: string | undefined;
  nextSrc: string | undefined;
  previousSection: string | undefined;
  previousContent: string | undefined;
  previousSrc: string | undefined;
}

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
