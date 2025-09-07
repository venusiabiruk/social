// API utilities for SocialSpark backend integration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ----- Types -----
export interface GenerateCaptionResponse {
  caption: string;
  hashtags: string[];
}

export interface GenerateImageResponse {
  image_url: string;
}

export interface StoryboardShot {
  id: string;
  description: string;
  image_url?: string; // optional for compatibility
  duration: number;
  transition?: string;
}

export interface GenerateStoryboardResponse {
  shots: StoryboardShot[];
}

export interface RenderVideoResponse {
  task_id: string;
  video_url?: string; // optional
}

export interface TaskStatus {
  status: "pending" | "processing" | "in_progress" | "completed" | "failed";
  progress?: number;
  error?: string;
  video_url?: string;
  result_url?: string;
}

export interface ExportContentResponse {
  download_url?: string;
  url?: string;
  format?: string;
  size?: number;
}

export interface ScheduledPostResponse {
  post_id?: string;
  scheduled_id?: string;
  scheduled_time: string;
  platforms?: string[];
  status?: "scheduled" | "failed";
}

// ----- API Functions -----
export async function generateCaption(
  prompt: string,
  businessType?: string,
  language: string = "en"
): Promise<GenerateCaptionResponse> {
  const response = await fetch(`${API_BASE_URL}/generate/caption`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, business_type: businessType, language }),
  });
  if (!response.ok) throw new Error(`Failed to generate caption: ${response.statusText}`);
  return response.json();
}

export async function generateImage(
  prompt: string,
  style: string = "realistic"
): Promise<GenerateImageResponse> {
  const response = await fetch(`${API_BASE_URL}/generate/image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, style }),
  });
  if (!response.ok) throw new Error(`Failed to generate image: ${response.statusText}`);
  return response.json();
}

export async function generateStoryboard(
  prompt: string,
  duration: number = 15
): Promise<GenerateStoryboardResponse> {
  const response = await fetch(`${API_BASE_URL}/generate/storyboard`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, duration }),
  });
  if (!response.ok) throw new Error(`Failed to generate storyboard: ${response.statusText}`);
  return response.json();
}

export async function renderVideo(
  storyboard: StoryboardShot[],
  audio?: string
): Promise<RenderVideoResponse> {
  const response = await fetch(`${API_BASE_URL}/render/video`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ storyboard, audio }),
  });
  if (!response.ok) throw new Error(`Failed to start video rendering: ${response.statusText}`);
  return response.json();
}

export async function getTaskStatus(taskId: string): Promise<TaskStatus> {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error(`Failed to get task status: ${response.statusText}`);
  return response.json();
}

export async function exportContent(
  contentId: string,
  format: "jpg" | "png" | "mp4" | "gif"
): Promise<ExportContentResponse> {
  const response = await fetch(`${API_BASE_URL}/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content_id: contentId, format }),
  });
  if (!response.ok) throw new Error(`Failed to export content: ${response.statusText}`);
  return response.json();
}

export async function schedulePost(
  content: GenerateCaptionResponse | GenerateImageResponse | GenerateStoryboardResponse,
  scheduledTime: string,
  platforms: string[]
): Promise<ScheduledPostResponse> {
  const response = await fetch(`${API_BASE_URL}/schedule`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, scheduled_time: scheduledTime, platforms }),
  });
  if (!response.ok) throw new Error(`Failed to schedule post: ${response.statusText}`);
  return response.json();
}

// ----- Polling Utility -----
export const pollTaskStatus = async (taskId: string) => {
  const response = await fetch(`/api/tasks/${taskId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch task status");
  }
  return response.json();
};

