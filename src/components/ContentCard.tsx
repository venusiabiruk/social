import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
import { Badge } from "@/components/badge";
import {
  Download,
  Edit,
  Trash2,
  Instagram,
  Video,
  Eye,
  Clock,
  Copy,
  Check,
  Share,
} from "lucide-react";
import { LibraryItem } from "@/types/library";

interface ContentCardProps {
  item: LibraryItem;
  copiedId: string | null;
  onExport: (item: LibraryItem) => void;
  onCopy: (item: LibraryItem) => void;
  onEdit: (item: LibraryItem) => void;
  onSchedule: (item: LibraryItem) => void;
  onDelete: (item: LibraryItem) => void;
}

export default function ContentCard({
  item,
  copiedId,
  onExport,
  onCopy,
  onEdit,
  onSchedule,
  onDelete,
}: ContentCardProps) {
  // Map original status to display status
  const statusText =
    item.status === "queued"
      ? "scheduled"
      : item.status === "done"
      ? "published"
      : "draft";

  return (
    <Card className="group hover:shadow-lg transition-shadow bg-[#D9D9D9]/[0.72]">
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        {/* Render video if available, else image */}
        {item.videoUrl ? (
          <video
            src={item.videoUrl}
            autoPlay
            muted
            loop
            controls
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        ) : (
          <Image
            src={item.imageUrl || "/placeholder.svg"}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        )}

        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <Badge
            variant={
              statusText === "draft"
                ? "default"
                : statusText === "scheduled"
                ? "secondary"
                : "outline"
            }
          >
            {statusText}
          </Badge>
        </div>

        {/* Platform / Video Icon */}
        <div className="absolute top-2 right-2 flex gap-1">
          {item.platform === "instagram" ? (
            <Instagram className="w-4 h-4 text-white bg-black/50 rounded p-0.5" />
          ) : (
            <Video className="w-4 h-4 text-white bg-black/50 rounded p-0.5" />
          )}
          {item.videoUrl && (
            <Video className="w-4 h-4 text-white bg-black/50 rounded p-0.5" />
          )}
        </div>

        {/* Hover Overlay Buttons */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Link href={`/view/${item.id}`} passHref>
              <Button
                size="sm"
                variant="secondary"
                className="flex items-center"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </Link>

            <Button size="sm" variant="secondary" onClick={() => onEdit(item)}>
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-3 sm:p-4">
        <h3 className="font-semibold mb-2 text-sm sm:text-base break-words line-clamp-2">
          {item.title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-3 break-words">
          {item.caption}
        </p>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {item.hashtags.map((hashtag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs px-2 py-1 break-all"
            >
              #{hashtag}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
          <div className="flex gap-1">
            {/* Post / Schedule button only for images */}
            {item.imageUrl && !item.videoUrl && (
              <Link href={`/post/${item.id}`} passHref>
                <Button
                  size="sm"
                  variant="ghost"
                  title="Post or schedule"
                  className="p-1 sm:p-2"
                >
                  <Share className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </Link>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={() => onExport(item)}
              title="Download"
              className="p-1 sm:p-2"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onCopy(item)}
              title="Copy caption and hashtags"
              className="p-1 sm:p-2"
            >
              {copiedId === item.id ? (
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              ) : (
                <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
            </Button>
            {/* <Button
              size="sm"
              variant="ghost"
              onClick={() => onSchedule(item)}
              title="set reminder to post"
              className="p-1 sm:p-2"
            >
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button> */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(item)}
              title="Delete snap"
              className="p-1 sm:p-2"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
