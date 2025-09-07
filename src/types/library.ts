export interface LibraryItem {
  id: string;
  title: string;
  caption: string;
  hashtags: string[];
  imageUrl: string;
  platform: string;
  contentType: string;
  type: string;
  videoUrl: string;
  createdAt: string;
  status: string;
  engagement: {
    likes: number;
    comments: number;
    views: number;
  };
}

export interface ContentItem {
  id: string;
  title: string;
  caption: string;
  hashtags: string[];
  imageUrl: string;
  videoUrl?: string;
  platform: string;
  type: string;
}

export interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error";
}

export interface FilterState {
  searchQuery: string;
  filterType: string;
  filterPlatform: string;
  viewMode: "grid" | "list";
}

export interface EditorContent {
  id: string;
  caption: string;
  hashtags: string[];
  imageUrl: string;
  platform: string;
  contentType: string;
  title: string;
}

export interface SchedulerContent {
  id: string;
  caption: string;
  hashtags: string[];
  imageUrl: string;
  platform: string;
  contentType: string;
  title: string;
}
