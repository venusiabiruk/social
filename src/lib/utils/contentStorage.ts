import { v4 as uuidv4 } from "uuid";
import { StoryboardShot } from "@/lib/types/api";

export interface ContentData {
  id: string;
  caption: string;
  hashtags: string[];
  imageUrl?: string;
  videoUrl?: string;
  platform: string;
  contentType: string;
  title: string;
  createdAt: string;
  storyboard?: StoryboardShot[];
  overlays?: { text: string; position?: string }[];
}

export const STORAGE_KEYS = {
  LIBRARY: "libraryContent",
  SCHEDULER: "schedulerContent",
  EDITOR: "editorContent",
  POST: "postContent",
  EXPORT: "exportDraft",
} as const;

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
type SingleStorageKey = Exclude<StorageKey, typeof STORAGE_KEYS.LIBRARY>;

export const contentStorage = {
  saveContent: (
    key: SingleStorageKey,
    content: Omit<ContentData, "id" | "createdAt">
  ): string => {
    try {
      const id = uuidv4();
      const contentWithId: ContentData = {
        ...content,
        id,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(key, JSON.stringify(contentWithId));
      return id;
    } catch (error) {
      console.error("Failed to save content:", error);
      throw new Error("Failed to save content");
    }
  },

  getContent: (key: SingleStorageKey): ContentData | null => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      return parsed && parsed.id ? parsed : null;
    } catch (error) {
      console.error("Failed to get content:", error);
      return null;
    }
  },

  findContentById: (id: string): ContentData | null => {
    try {
      const singleKeys: SingleStorageKey[] = [
        STORAGE_KEYS.SCHEDULER,
        STORAGE_KEYS.EDITOR,
        STORAGE_KEYS.POST,
        STORAGE_KEYS.EXPORT,
      ];

      for (const key of singleKeys) {
        const content = contentStorage.getContent(key);
        if (content?.id === id) return content;
      }

      const libraryItem = contentStorage.getFromLibrary(id);
      return libraryItem;
    } catch (error) {
      console.error("Failed to find content:", error);
      return null;
    }
  },

  saveToLibrary: (content: Omit<ContentData, "id" | "createdAt">): string => {
    try {
      const id = uuidv4();
      const library = contentStorage.getLibrary();
      const newContent: ContentData = {
        ...content,
        id,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(
        STORAGE_KEYS.LIBRARY,
        JSON.stringify([...library, newContent])
      );
      return id;
    } catch (error) {
      console.error("Failed to save to library:", error);
      throw new Error("Failed to save to library");
    }
  },

  getLibrary: (): ContentData[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LIBRARY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Failed to get library:", error);
      return [];
    }
  },

  getFromLibrary: (id: string): ContentData | null => {
    return contentStorage.getLibrary().find((item) => item.id === id) || null;
  },

  updateInLibrary: (id: string, updates: Partial<ContentData>): boolean => {
    try {
      const library = contentStorage.getLibrary();
      const index = library.findIndex((item) => item.id === id);
      if (index === -1) return false;

      library[index] = { ...library[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(library));
      return true;
    } catch (error) {
      console.error("Failed to update library item:", error);
      return false;
    }
  },

  removeFromLibrary: (id: string): boolean => {
    try {
      const library = contentStorage.getLibrary();
      const updated = library.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error("Failed to remove from library:", error);
      return false;
    }
  },

  clearAll: (): void => {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error("Failed to clear storage:", error);
    }
  },

  getAllContent: (): ContentData[] => {
    try {
      const all: ContentData[] = [];

      const singleKeys: SingleStorageKey[] = [
        STORAGE_KEYS.SCHEDULER,
        STORAGE_KEYS.EDITOR,
        STORAGE_KEYS.POST,
        STORAGE_KEYS.EXPORT,
      ];

      singleKeys.forEach((key) => {
        const content = contentStorage.getContent(key);
        if (content) all.push(content);
      });

      all.push(...contentStorage.getLibrary());

      return all;
    } catch (error) {
      console.error("Failed to get all content:", error);
      return [];
    }
  },
};
