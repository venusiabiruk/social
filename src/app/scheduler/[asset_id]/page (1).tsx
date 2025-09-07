"use client";

import React, { JSX, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { Button } from "@/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Label } from "@/components/label";
import { Badge } from "@/components/badge";
import { Calendar } from "@/components/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import {
  Clock,
  Instagram,
  Video,
  Plus,
  ArrowLeft,
  Loader2,
  ImageIcon,
} from "lucide-react";
import Schedulerheader from "@/components/schedulerHeader";
import { useReminderMutation, useReminderStatusQuery } from "@/lib/redux/services/api";
import Toast from "@/components/Toast";
import { ToastState } from "@/types/library";
import { contentStorage, ContentData } from "@/lib/utils/contentStorage";

/* ----------------------- Types ----------------------- */

type Platform = "instagram" | "tiktok";

interface EditorContent {
  id: string;
  imageUrl?: string;
  caption: string;
  hashtags: string[];
  contentType: "image" | "video";
  videoUrl?: string;
  storyboard?: unknown[];
  overlays?: unknown[];
  platform: string;
  title: string;
  createdAt: string;
  status?: string;
}

/** Expected response from schedule mutation */
interface ReminderResponse {
  status: string;
  scheduled_for?: string;
  detail?: unknown;
}

/** Expected shape for status polling */
interface ReminderStatus {
  asset_id: string;
  platform: string;
  run_at?: string;
  status: string;
}

/* ----------------------- Type guards ----------------------- */

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

function isReminderResponse(v: unknown): v is ReminderResponse {
  return isObject(v) && typeof v.status === "string";
}

function isReminderStatus(v: unknown): v is ReminderStatus {
  return (
    isObject(v) &&
    typeof (v as Record<string, unknown>).status === "string" &&
    typeof (v as Record<string, unknown>).asset_id === "string"
  );
}

/* ----------------------- Helpers ----------------------- */

/**
 * Convert a stored ContentData into the EditorContent shape used by the UI.
 * NOTE: ContentData may not include `status` — EditorContent.status remains optional
 * and will be set later when the library is updated.
 */
const convertToEditorContent = (content: ContentData): EditorContent => {
  const contentType = content.contentType === "video" ? "video" : "image";
  return {
    id: content.id,
    imageUrl: content.imageUrl,
    caption: content.caption ?? "",
    hashtags: content.hashtags ?? [],
    contentType,
    videoUrl: content.videoUrl,
    storyboard: content.storyboard ?? [],
    overlays: content.overlays ?? [],
    platform: content.platform ?? "instagram",
    title: content.title ?? "Untitled",
    createdAt: content.createdAt ?? new Date().toISOString(),
    // intentionally do NOT read content.status here because ContentData doesn't define it
  };
};

/* ----------------------- Component ----------------------- */

export default function SchedulerPage(): JSX.Element {
  const router = useRouter();
  const params = useParams() as { asset_id?: string } | undefined;
  const assetId = params?.asset_id ?? undefined;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("09:00");
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("instagram");
  const [editorContent, setEditorContent] = useState<EditorContent | null>(null);
  const [isScheduling, setIsScheduling] = useState<boolean>(false);
  const [scheduledAssetId, setScheduledAssetId] = useState<string | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);

  const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "success" });

  // mutation
  const [triggerReminder, { isLoading: isReminderLoading }] = useReminderMutation();

  // conditional query
  const { data: reminderStatusData, error: statusError } = useReminderStatusQuery(
    scheduledAssetId ?? skipToken,
    { pollingInterval: 15000 }
  );

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    globalThis.setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  /* ---------- Load content from storage ---------- */
  useEffect(() => {
    const load = async () => {
      if (!assetId) {
        showToast("No asset ID provided", "error");
        setIsLoadingContent(false);
        return;
      }

      try {
        const found = typeof contentStorage?.findContentById === "function"
          ? contentStorage.findContentById(assetId)
          : null;

        if (!found) {
          showToast("Content not found. Please generate content first.", "error");
          setIsLoadingContent(false);
          return;
        }

        const ec = convertToEditorContent(found);
        setEditorContent(ec);

        if (ec.platform === "tiktok" || ec.platform === "instagram") {
          setSelectedPlatform(ec.platform as Platform);
        } else {
          setSelectedPlatform("instagram");
        }
      } catch (err) {
        console.error("Failed to load content:", err);
        showToast("Failed to load content", "error");
      } finally {
        setIsLoadingContent(false);
      }
    };

    load();
  }, [assetId]);

  /* ---------- Handle polled status updates ---------- */
  useEffect(() => {
    if (!reminderStatusData) return;

    // defensive: ensure shape matches ReminderStatus
    if (isReminderStatus(reminderStatusData)) {
      if (reminderStatusData.status === "done") {
        showToast("Content has been published!", "success");

        if (editorContent && assetId && typeof contentStorage?.updateInLibrary === "function") {
          const updated = { ...editorContent, status: "published" };
          try {
            contentStorage.updateInLibrary(assetId, updated as unknown as ContentData);
            setEditorContent(updated);
          } catch (e) {
            console.warn("Failed to update library status:", e);
          }
        }

        setScheduledAssetId(null);
      }
    } else {
      console.warn("Unexpected reminderStatus shape:", reminderStatusData);
    }
  }, [reminderStatusData, editorContent, assetId]);

  useEffect(() => {
    if (statusError) {
      console.error("Status check error:", statusError);
      showToast("Failed to check scheduling status", "error");
    }
  }, [statusError]);

  const optimalTimes: Record<Platform, string[]> = {
    instagram: ["09:00", "12:00", "17:00", "20:00"],
    tiktok: ["06:00", "10:00", "19:00", "21:00"],
  };

  /* ---------- Schedule handler ---------- */
  const handleScheduleReminder = async () => {
    if (!selectedDate || !editorContent || !assetId) {
      showToast("Please select a date and ensure content is loaded", "error");
      return;
    }

    setIsScheduling(true);

    try {
      const scheduledDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(":").map((v) => Number(v));
      scheduledDateTime.setHours(hours, minutes, 0, 0);

      const requestPayload = {
        asset_id: assetId,
        platform: selectedPlatform,
        run_at: scheduledDateTime.toISOString(),
      };

      const rawResponse = await triggerReminder(requestPayload).unwrap();

      if (isReminderResponse(rawResponse)) {
        const status = rawResponse.status;
        const scheduledFor = rawResponse.scheduled_for ?? undefined;

        if (status === "scheduled" || status === "queued") {
          setScheduledAssetId(assetId);

          const updated = { ...editorContent, status: "scheduled" };
          if (typeof contentStorage?.updateInLibrary === "function") {
            try {
              contentStorage.updateInLibrary(assetId, updated as unknown as ContentData);
            } catch (e) {
              console.warn("Failed to update library:", e);
            }
          }

          setEditorContent(updated);

          showToast(
            `Content scheduled for ${scheduledFor ?? scheduledDateTime.toLocaleString()}!`,
            "success"
          );

          globalThis.setTimeout(() => router.push("/library"), 1400);
          return;
        }
      }

      // If we reach here, the response wasn't a successful scheduled/queued response
      throw new Error("Failed to schedule reminder");
    } catch (err) {
      console.error("Scheduling failed:", err);

      let message = "Failed to schedule reminder. Please try again.";
      // Extract message safely from unknown
      if (isObject(err) && typeof (err as Record<string, unknown>).message === "string") {
        message = (err as Record<string, unknown>).message as string;
      } else if (isObject(err) && (err as Record<string, unknown>).detail) {
        const detail = (err as Record<string, unknown>).detail;
        if (typeof detail === "string") message = detail;
        else if (Array.isArray(detail) && detail[0] && typeof (detail[0] as Record<string, unknown>)?.msg === "string") {
          message = (detail[0] as Record<string, unknown>).msg as string;
        }
      }

      showToast(message, "error");
    } finally {
      setIsScheduling(false);
    }
  };

  const formatScheduledTime = (dateTime?: string) =>
    dateTime ? new Date(dateTime).toLocaleString() : "";

  /* ----------------------- UI ----------------------- */

  if (isLoadingContent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Schedulerheader />
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {editorContent ? (
              <>
                {/* Content Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">Content Preview</CardTitle>
                    <CardDescription>Content ready to be scheduled (Asset ID: {assetId})</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 p-4 border rounded-lg bg-muted/50">
                      {editorContent.imageUrl && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={editorContent.imageUrl}
                            alt="Content preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {editorContent.videoUrl && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-black flex items-center justify-center">
                          <Video className="w-8 h-8 text-white" />
                        </div>
                      )}

                      {!editorContent.imageUrl && !editorContent.videoUrl && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold mb-1">{editorContent.title}</h4>
                        <p className="text-sm mb-2 line-clamp-2">{editorContent.caption || "No caption"}</p>

                        <div className="flex flex-wrap gap-1 mb-2">
                          {editorContent.hashtags.slice(0, 3).map((h, i) => (
                            <span key={i} className="text-xs text-blue-600">
                              #{h}
                            </span>
                          ))}
                          {editorContent.hashtags.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{editorContent.hashtags.length - 3} more
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {editorContent.contentType === "video" ? "Video" : "Image"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {selectedPlatform}
                          </Badge>
                          <Badge
                            variant={editorContent.status === "scheduled" ? "default" : "outline"}
                            className="text-xs"
                          >
                            {editorContent.status ?? "draft"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Scheduler Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">Schedule Reminder</CardTitle>
                    <CardDescription>Set when you want to be reminded to post this content</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Platform</Label>
                          <Select
                            value={selectedPlatform}
                            onValueChange={(v) => setSelectedPlatform(v as Platform)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem value="instagram">
                                <div className="flex items-center gap-2">
                                  <Instagram className="w-4 h-4" />
                                  Instagram
                                </div>
                              </SelectItem>
                              <SelectItem value="tiktok">
                                <div className="flex items-center gap-2">
                                  <Video className="w-4 h-4" />
                                  TikTok
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Time</Label>
                          <Select value={selectedTime} onValueChange={setSelectedTime}>
                            <SelectTrigger>
                              <Clock className="w-4 h-4 mr-2" />
                              <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                              {optimalTimes[selectedPlatform].map((t) => (
                                <SelectItem key={t} value={t}>
                                  {t}
                                </SelectItem>
                              ))}

                              {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0") + ":00")
                                .filter((t) => !optimalTimes[selectedPlatform].includes(t))
                                .map((t) => (
                                  <SelectItem key={t} value={t}>
                                    {t}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Optimal Times for {selectedPlatform}</Label>
                          <div className="flex flex-wrap gap-2">
                            {optimalTimes[selectedPlatform].map((time) => (
                              <Button
                                key={time}
                                variant={selectedTime === time ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedTime(time)}
                              >
                                {time}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label>Select Date</Label>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(d) => setSelectedDate(d ?? undefined)}
                          className="rounded-md border"
                          disabled={(d) => d < new Date()}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t">
                      <Button
                        onClick={handleScheduleReminder}
                        disabled={
                          isScheduling ||
                          isReminderLoading ||
                          !selectedDate ||
                          editorContent.status === "scheduled"
                        }
                        className="flex-1"
                      >
                        {isScheduling ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Setting Reminder...
                          </>
                        ) : editorContent.status === "scheduled" ? (
                          "Already Scheduled"
                        ) : (
                          <>
                            <Clock className="w-4 h-4 mr-2" />
                            Set Reminder
                          </>
                        )}
                      </Button>

                      <Button variant="outline" onClick={() => router.push("/library")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Library
                      </Button>
                    </div>

                    {isObject(reminderStatusData) && isReminderStatus(reminderStatusData) && (
                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-2">Scheduling Status</h4>
                        <p className="text-sm">
                          Status: <Badge variant="outline">{reminderStatusData.status}</Badge>
                        </p>
                        {reminderStatusData.run_at && (
                          <p className="text-sm mt-1">Scheduled for: {formatScheduledTime(reminderStatusData.run_at)}</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Content Not Found</CardTitle>
                  <CardDescription>
                    The requested content could not be found. Please generate content first.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" onClick={() => router.push("/dashboard")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/library")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    View Library
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Best Posting Times</CardTitle>
                <CardDescription>Based on your audience engagement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Instagram className="w-4 h-4" />
                      <span className="text-sm">Instagram</span>
                    </div>
                    <Badge variant="outline">9 AM, 12 PM, 5 PM</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      <span className="text-sm">TikTok</span>
                    </div>
                    <Badge variant="outline">6 AM, 10 AM, 7 PM</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/library")}>
                  <Plus className="w-4 h-4 mr-2" />
                  View Library
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/dashboard")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Content
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
