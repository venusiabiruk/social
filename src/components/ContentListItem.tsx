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
  ImageIcon,
  Calendar,
  Share,
} from "lucide-react";
import { LibraryItem } from "@/types/library";

interface ContentListItemProps {
  item: LibraryItem;
  copiedId: string | null;
  onExport: (item: LibraryItem) => void;
  onCopy: (item: LibraryItem) => void;
  onCopyHashtags: (item: LibraryItem) => void;
  onEdit: (item: LibraryItem) => void;
  onSchedule: (item: LibraryItem) => void;
  onDelete: (item: LibraryItem) => void;
}

export default function ContentListItem({
  item,
  copiedId,
  onExport,
  onCopy,
  onEdit,
  onSchedule,
  onDelete,
}: ContentListItemProps) {
  // Map status for display
  const displayStatus =
    item.status === "queued"
      ? "scheduled"
      : item.status === "done"
      ? "published"
      : "draft";

  return (
    <Card className="group hover:shadow-lg transition-shadow bg-[#D9D9D9]/[0.72]">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Image or Video */}
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            {item.videoUrl ? (
              <video
                src={item.videoUrl}
                controls
                className="w-full h-full object-cover"
              />
            ) : item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={64}
                height={64}
                className="object-cover"
              />
            ) : (
              <Image
                src="/placeholder.svg"
                alt="placeholder"
                width={64}
                height={64}
                className="object-cover"
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            {/* Title + Status */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3 className="font-semibold text-sm sm:text-base break-words line-clamp-2">
                {item.title}
              </h3>
              <Badge
                variant={
                  displayStatus === "published"
                    ? "outline"
                    : displayStatus === "scheduled"
                    ? "secondary"
                    : "default"
                }
                className="self-start sm:self-center text-xs sm:text-sm"
              >
                {displayStatus}
              </Badge>
            </div>

            {/* Caption */}
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 break-words">
              {item.caption}
            </p>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-1">
              {item.hashtags.map((hashtag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs sm:text-sm px-2 py-1 break-all"
                >
                  #{hashtag}
                </Badge>
              ))}
            </div>

            {/* Metadata */}
            {/* Metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                {item.platform === "instagram" ? (
                  <Instagram className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <Video className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                <span className="hidden sm:inline">{item.platform}</span>
              </div>
              <div className="flex items-center gap-1">
                {item.videoUrl ? (
                  <Video className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                <span className="hidden sm:inline">
                  {item.videoUrl ? "video" : "image"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* All Buttons Horizontal */}
          <div className="flex flex-row gap-2 overflow-x-auto mt-2 sm:mt-0">
            <Link href={`/view/${item.id}`}>
              <Button
                size="sm"
                variant="ghost"
                className="flex justify-center p-2 flex-shrink-0"
                title="watch detailed view"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </Link>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(item)}
              title="Edit"
              className="flex justify-center p-2 flex-shrink-0"
            >
              <Edit className="w-4 h-4" />
            </Button>

            {/* <Button
              size="sm"
              variant="ghost"
              onClick={() => onSchedule(item)}
              title="set reminder to post"
              className="flex justify-center p-2 flex-shrink-0"
            >
              <Clock className="w-4 h-4" />
            </Button> */}

            {/* Post / Schedule button only for images */}
            {item.imageUrl && (
              <Link href={`/post/${item.id}`}>
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex justify-center p-2 flex-shrink-0"
                  title="Post / Schedule"
                >
                  <Share className="w-4 h-4" />
                </Button>
              </Link>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={() => onExport(item)}
              title="Download"
              className="flex justify-center p-2 flex-shrink-0"
            >
              <Download className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => onCopy(item)}
              title="Copy caption and hashtags"
              className="flex justify-center p-2 flex-shrink-0"
            >
              {copiedId === item.id ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(item)}
              title="Delete snap"
              className="flex justify-center p-2 flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
