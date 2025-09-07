import { LibraryItem, EditorContent, SchedulerContent } from "@/types/library";

class LibraryService {
  private storageKey = "libraryContent";

  // Get all library content
  async getLibraryContent(): Promise<LibraryItem[]> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      } else {
        return [];
      }
    } catch (error) {
      console.error("Failed to fetch library content:", error);
      return [];
    }
  }

  // Save library content
  async saveLibraryContent(content: LibraryItem[]): Promise<void> {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(content));
    } catch (error) {
      console.error("Failed to save library content:", error);
      throw error;
    }
  }

  // Delete a library item
  async deleteLibraryItem(id: string): Promise<void> {
    try {
      const content = await this.getLibraryContent();
      const updatedContent = content.filter((item) => item.id !== id);
      await this.saveLibraryContent(updatedContent);
    } catch (error) {
      console.error("Failed to delete library item:", error);
      throw error;
    }
  }

  // Get a specific library item by ID
  async getLibraryItem(id: string): Promise<LibraryItem | null> {
    try {
      const content = await this.getLibraryContent();
      return content.find((item) => item.id === id) || null;
    } catch (error) {
      console.error("Failed to fetch library item:", error);
      return null;
    }
  }

  // Update a library item
  async updateLibraryItem(
    id: string,
    updates: Partial<LibraryItem>
  ): Promise<LibraryItem | null> {
    try {
      const content = await this.getLibraryContent();
      const itemIndex = content.findIndex((item) => item.id === id);

      if (itemIndex === -1) return null;

      content[itemIndex] = { ...content[itemIndex], ...updates };
      await this.saveLibraryContent(content);

      return content[itemIndex];
    } catch (error) {
      console.error("Failed to update library item:", error);
      throw error;
    }
  }
  // Save editor content
  saveEditorContent(content: EditorContent): void {
    try {
      localStorage.setItem("editorContent", JSON.stringify(content));
    } catch (error) {
      console.error("Failed to save editor content:", error);
      throw error;
    }
  }

  // Save scheduler content
  saveSchedulerContent(content: SchedulerContent): void {
    try {
      localStorage.setItem("schedulerContent", JSON.stringify(content));
    } catch (error) {
      console.error("Failed to save scheduler content:", error);
      throw error;
    }
  }
  // Export image / video with blob-based download (reliable across browsers)
  async exportImage(url: string, filename: string) {
    await this.downloadFile(url, filename);
  }

  async downloadVideo(url: string, filename: string) {
    await this.downloadFile(url, filename);
  }

  private async downloadFile(url: string, filename: string) {
    const absoluteUrl = url.startsWith("http")
      ? url
      : `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
    try {
      const response = await fetch(absoluteUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`);
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      // Cleanup
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("Blob download failed, attempting direct link:", err);
      try {
        const anchor = document.createElement("a");
        anchor.href = absoluteUrl;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      } catch (fallbackErr) {
        console.error(
          "Direct download fallback failed, opening in new tab:",
          fallbackErr
        );
        try {
          window.open(absoluteUrl, "_blank");
        } catch (openErr) {
          console.error("Open in new tab failed:", openErr);
          throw openErr;
        }
      }
    }
  }

  // Copy text to clipboard
  async copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Failed to copy text:", error);
      throw error;
    }
  }

  // Filter content based on search and filters
  filterContent(
    content: LibraryItem[],
    searchQuery: string,
    filterType: string,
    filterPlatform: string
  ): LibraryItem[] {
    return content.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.caption.toLowerCase().includes(searchQuery.toLowerCase());
      const isImage = !!item.imageUrl && !item.videoUrl;
      const isVideo = !!item.videoUrl;
      const matchesType =
        filterType === "all" ||
        (filterType === "image" && isImage) ||
        (filterType === "video" && isVideo);
      const matchesPlatform =
        filterPlatform === "all" || item.platform === filterPlatform;

      return matchesSearch && matchesType && matchesPlatform;
    });
  }
}

export const libraryService = new LibraryService();
export default libraryService;
