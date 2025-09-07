"use client";
import { Button } from "@/components/button";
import { RotateCcw, Download, Clock, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { StoryboardShot } from "@/lib/types/api";
import { useState } from "react";
import { contentStorage } from "@/lib/utils/contentStorage";
import { TitlePromptModal } from "./TitleModal";
import Toast from "@/components/Toast";
import { ToastState } from "@/types/library";
import libraryService from "@/services/libraryService";

interface ActionsProps {
  generatedContent: {
    caption: string;
    hashtags: string[];
    imageUrl?: string;
    videoUrl?: string;
    taskId: string;
    storyboard?: StoryboardShot[];
    overlays?: { text: string; position?: string }[];
  };
  platform: string;
  contentType: string;
  t: Record<string, string>;
  onRegenerate: () => void;
}

export default function Actions({
  generatedContent,
  platform,
  contentType,
  t,
  onRegenerate,
}: ActionsProps) {
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [savingRoute, setSavingRoute] = useState<
    "scheduler" | "editor" | "post" | "library"
  >("library");

  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000
    );
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (contentType === "image" && generatedContent.imageUrl) {
        await exportAsFile(generatedContent.imageUrl, "png");
        showToast("Image download started!", "success");
      } else if (contentType === "video" && generatedContent.videoUrl) {
        await exportAsFile(generatedContent.videoUrl, "mp4");
        showToast("Video download started!", "success");
      } else {
        exportAsText();
        showToast("Text content downloaded!", "success");
      }
    } catch (error) {
      console.error("Export failed:", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to export content. Please try again.",
        "error"
      );
    } finally {
      setIsExporting(false);
    }
  };
  const exportAsFile = async (fileUrl: string, extension: "png" | "mp4") => {
    try {
      const fileName = generatedContent.caption
        ? `${generatedContent.caption
            .split(" ")
            .slice(0, 6)
            .join("_")}.${extension}`
        : `social_content_${Date.now()}.${extension}`;

      if (extension === "png") {
        await libraryService.exportImage(fileUrl, fileName);
      } else if (extension === "mp4") {
        await libraryService.downloadVideo(fileUrl, fileName);
      }
    } catch (error) {
      console.error("File export error:", error);

      window.open(fileUrl, "_blank");
      throw new Error("Failed to download. Opened in new tab instead.");
    }
  };
  const exportAsText = () => {
    const content = `
SOCIAL MEDIA CONTENT
====================
Platform: ${platform}
Type: ${contentType}
Date: ${new Date().toLocaleString()}

CAPTION:
${generatedContent.caption}

HASHTAGS:
${generatedContent.hashtags.join(" ")}

${
  contentType === "video" && generatedContent.storyboard
    ? `
STORYBOARD:
${generatedContent.storyboard
  .map(
    (shot, index) => `
Shot ${index + 1}:
- Text: ${shot.text}
- Duration: ${shot.duration}s
`
  )
  .join("\n")}`
    : ""
}
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.download = `content_${Date.now()}.txt`;
    link.href = url;
    link.click();

    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const handleSaveWithTitle = async (
    title: string,
    route: "scheduler" | "editor" | "post" | "library"
  ) => {
    try {
      const contentData = {
        caption: generatedContent.caption,
        hashtags: generatedContent.hashtags,
        imageUrl: generatedContent.imageUrl,
        videoUrl: generatedContent.videoUrl,
        platform,
        contentType: contentType,
        title: title.trim(),
        ...(contentType === "video" && {
          storyboard: generatedContent.storyboard,
          overlays: generatedContent.overlays,
        }),
      };

      let id: string;

      if (route === "library" || route === "post") {
        // Save both Library and Post content under 'libraryContent'
        id = contentStorage.saveToLibrary(contentData);

        // Only show toast for library, not for post
        if (route === "library") {
          showToast("Content saved to library successfully!", "success");
        }

        if (route === "post") {
          // Navigate to post page without showing toast
          router.push(`/post/${id}`);
        }
      } else {
        // Use contentStorage for scheduler and editor
        const storageKeyMap = {
          scheduler: "schedulerContent" as const,
          editor: "editorContent" as const,
        };
        id = contentStorage.saveContent(storageKeyMap[route], contentData);
        router.push(`/${route}/${id}`);
      }
    } catch (error) {
      console.error(`Failed to save for ${route}:`, error);
      showToast(`Failed to save content. Please try again.`, "error");
    }
  };

  const handleSaveAndNavigate = (
    route: "scheduler" | "editor" | "post" | "library"
  ) => {
    const defaultTitle = generatedContent.caption
      .split(" ")
      .slice(0, 6)
      .join(" ");

    if (route === "library") {
      setSavingRoute(route);
      setShowTitleModal(true);
    } else {
      handleSaveWithTitle(defaultTitle, route);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-3 pt-6 border-t">
        <Button onClick={onRegenerate} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t.regenerate}
        </Button>

        <Button
          variant="secondary"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              {t.export}
            </>
          )}
        </Button>

        {/* <Button
          variant="outline"
          onClick={() => handleSaveAndNavigate("scheduler")}
        >
          <Clock className="w-4 h-4 mr-2" />
          {t.schedule}
        </Button> */}

        <Button
          variant="outline"
          onClick={() => handleSaveAndNavigate("library")}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          {t.contentLibrary}
        </Button>

        {contentType === "image" && (
          <>
            <Button
              variant="outline"
              onClick={() => handleSaveAndNavigate("post")}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              {t.post}
            </Button>
          </>
        )}
      </div>

      <TitlePromptModal
        isOpen={showTitleModal}
        onClose={() => setShowTitleModal(false)}
        onSave={(title) => handleSaveWithTitle(title, savingRoute)}
        defaultTitle={generatedContent.caption.split(" ").slice(0, 6).join(" ")}
      />

      <Toast toast={toast} />
    </>
  );
}
