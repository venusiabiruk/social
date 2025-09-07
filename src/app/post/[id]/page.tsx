"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Label } from "@/components/label";
import Toast from "@/components/Toast";
import { useSchedulePostMutation } from "@/lib/redux/services/api";
import type { ToastState, LibraryItem } from "@/types/library";
import libraryService from "@/services/libraryService";
import { ArrowLeft } from "lucide-react";
import { contentStorage } from "@/lib/utils/contentStorage";

const PLATFORMS = ["instagram", "pinterest"] as const;

export default function PostSchedulePage() {
  const params = useParams();
  const router = useRouter();

  const [postText, setPostText] = useState<string>("");
  const [runAt, setRunAt] = useState<string>("");
  const [platforms, setPlatforms] = useState<string[]>(["instagram"]);
  const [item, setItem] = useState<LibraryItem | null>(null);

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

  // Load library item
  useEffect(() => {
    const load = async () => {
      const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
      if (!id) return;

      try {
        const fetched = await libraryService.getLibraryItem(id);
        if (fetched) {
          setItem(fetched);
          if (!postText) {
            setPostText(fetched.caption + " " + fetched.hashtags.join(" "));
          }
          return;
        }

        const postContent = contentStorage.getContent("postContent");
        if (postContent && postContent.id === id) {
          const normalized: LibraryItem = {
            ...postContent,
            imageUrl: postContent.imageUrl ?? "",
            videoUrl: postContent.videoUrl ?? "",
            type: "post", // 👈 you can adjust depending on use case
            status: "draft",
            engagement: { likes: 0, comments: 0, views: 0 },
          };
          setItem(normalized);
          if (!postText) {
            setPostText(
              postContent.caption + " " + postContent.hashtags.join(" ")
            );
          }
        }
      } catch (err) {
        console.error("Failed to load post item:", err);
      }
    };
    load();
  }, [params?.id]);

  const [schedulePost, { isLoading }] = useSchedulePostMutation();

  const getErrorMessage = (err: unknown): string => {
    if (typeof err === "string") return err;
    if (err && typeof err === "object") {
      const obj = err as Record<string, unknown>;
      const data = obj["data"] as Record<string, unknown> | undefined;
      if (data) {
        const detail = data["detail"] as unknown;
        if (Array.isArray(detail) && detail.length) {
          const first = detail[0] as Record<string, unknown>;
          const msg =
            first && typeof first["msg"] === "string"
              ? first["msg"]
              : undefined;
          if (msg) return msg;
        }
        const message = data["message"];
        if (typeof message === "string") return message;
      }
      const message = obj["message"];
      if (typeof message === "string") return message;
    }
    return "Failed to schedule post.";
  };

  const validate = (): string | null => {
    if (!item?.imageUrl) return "Missing asset image URL.";
    if (!postText.trim()) return "Post text is required.";
    if (!platforms.length) return "Select at least one platform.";
    return null;
  };

  const handleSubmit = async (immediate: boolean) => {
    const error = validate();
    if (error) {
      showToast(error, "error");
      return;
    }

    if (!immediate && !runAt) {
      showToast("Please select a schedule time or use Post Now.", "error");
      return;
    }

    try {
      let targetRunAt: string | undefined = undefined;

      if (!immediate && runAt) {
        const date = new Date(runAt);
        if (isNaN(date.getTime())) {
          showToast("Invalid schedule time.", "error");
          return;
        }
        targetRunAt = date.toISOString();
      }

      const response = await schedulePost({
        asset_id: item!.imageUrl, // use imageUrl as asset_id
        platforms: platforms,
        post_text: postText.trim(),
        eta: targetRunAt,
      }).unwrap();

      // Update status of the library item
      if (item) {
        await libraryService.updateLibraryItem(item.id, {
          status: immediate ? "done" : "queued",
        });

        setItem((prev) =>
          prev ? { ...prev, status: immediate ? "done" : "queued" } : prev
        );
      }

      showToast(
        immediate
          ? "Post published successfully!"
          : `Post scheduled successfully for ${new Date(
              targetRunAt!
            ).toLocaleString()}`,
        "success"
      );

      console.log("Schedule response:", response);

      setTimeout(() => router.push("/library"), 2000);
    } catch (e: unknown) {
      const apiMsg = getErrorMessage(e);
      showToast(apiMsg, "error");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <button
          onClick={() => router.push("/library")}
          className="flex items-center gap-2 mb-4 text-sm text-primary font-medium hover:text-accent transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </button>

        <Card className="bg-[#D9D9D9]/[0.72]">
          <CardHeader>
            <CardTitle className="text-xl">Post or Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {item && (
              <div className="flex gap-4 p-4 border rounded-lg bg-muted/50">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold mb-1 line-clamp-2">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.caption}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Platforms</Label>
              <div className="flex gap-2 flex-wrap">
                {PLATFORMS.map((platform) => {
                  const selected = platforms.includes(platform);
                  return (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => {
                        if (selected) {
                          setPlatforms(platforms.filter((p) => p !== platform));
                        } else {
                          setPlatforms([...platforms, platform]);
                        }
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selected
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                Click to select multiple platforms
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postText">Post Text</Label>
              <textarea
                id="postText"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                className="w-full min-h-[120px] rounded-md border border-gray-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-black"
                placeholder="Write your post..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="runAt">Schedule Time (optional)</Label>
              <input
                id="runAt"
                type="datetime-local"
                value={runAt}
                onChange={(e) => setRunAt(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white p-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to post immediately using Post Now.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => handleSubmit(false)}
                disabled={isLoading}
                className="flex-1"
              >
                Schedule Post
              </Button>
              <Button
                onClick={() => handleSubmit(true)}
                disabled={isLoading}
                variant="outline"
                className="flex-1"
              >
                Post Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
