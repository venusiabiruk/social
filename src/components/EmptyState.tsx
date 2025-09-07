import Link from "next/link";
import { Sparkles, Search } from "lucide-react";
import { Button } from "@/components/button";

interface EmptyStateProps {
  searchQuery: string;
  onClearSearch: () => void;
}

export default function EmptyState({
  searchQuery,
  onClearSearch,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        {searchQuery ? (
          <Search className="w-8 h-8 text-muted-foreground" />
        ) : (
          <Sparkles className="w-8 h-8 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-lg font-semibold mb-2">
        {searchQuery ? "No content found" : "No content yet"}
      </h3>
      <p className="text-muted-foreground mb-4">
        {searchQuery
          ? "Try adjusting your search terms or create new content"
          : "Start creating your first piece of content to build your library"}
      </p>
      <div className="flex gap-3 justify-center">
        <Button asChild>
          <Link href="/dashboard">
            <Sparkles className="w-4 h-4 mr-2" />
            Create Content
          </Link>
        </Button>
        {searchQuery && (
          <Button variant="outline" onClick={onClearSearch}>
            Clear Search
          </Button>
        )}
      </div>
    </div>
  );
}
