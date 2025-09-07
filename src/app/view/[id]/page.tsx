"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/card";
import { Textarea } from "../../../components/textarea";
import { Badge } from "../../../components/badge";
import Toast from "@/components/Toast";
import { ImageIcon, Camera, Hash, Type, Play, ArrowLeft } from "lucide-react";
import { ContentItem, ToastState } from "@/types/library";
import libraryService from "@/services/libraryService";

export default function Page() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();
  const [content, setContent] = useState<ContentItem | null>(null);

  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (!id) return;

    const loadContent = async () => {
      try {
        const item = await libraryService.getLibraryItem(id);
        console.log("item", item);
        if (item) {
          setContent({
            id: item.id,
            title: item.title,
            caption: item.caption,
            hashtags: item.hashtags,
            imageUrl: item.imageUrl,
            videoUrl: item.videoUrl,
            platform: item.platform,
            type: item.type,
          });
        }
      } catch (error) {
        console.error("Failed to load content:", error);
        showToast("Failed to load content", "error");
      }
    };

    loadContent();
  }, [id]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000
    );
  };

  if (!content) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No content to display.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Back Button */}
      <button
        onClick={() => router.push("/library")}
        className="flex items-center gap-2 mb-4 text-sm text-primary font-medium hover:text-accent transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Library
      </button>

      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">{content.title}</h1>

          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-secondary" />
            Generated Content
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Caption & Hashtags */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Type className="w-4 h-4" />
                  <label className="font-medium">Caption</label>
                </div>
                <Textarea
                  value={content.caption}
                  readOnly
                  className="min-h-[120px]"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="w-4 h-4" />
                  <label className="font-medium">Hashtags</label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {content.hashtags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Visual Preview */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ImageIcon className="w-4 h-4" />
                <label className="font-medium">Preview</label>
              </div>
              <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center relative">
                {content.imageUrl ? (
                  <Image
                    src={content.imageUrl}
                    alt={content.title}
                    fill
                    className="object-cover"
                  />
                ) : content.videoUrl ? (
                  <video
                    src={content.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Play className="w-12 h-12 mb-2" />
                    <span>No Preview Available</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toast Notifications */}
      <Toast toast={toast} />
    </div>
  );
}
