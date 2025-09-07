import { Search, Filter, Grid3X3, List } from "lucide-react";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { FilterState } from "@/types/library";

interface SearchAndFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
}

export default function SearchAndFilters({
  filters,
  onFiltersChange,
}: SearchAndFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your content..."
            value={filters.searchQuery}
            onChange={(e) => onFiltersChange({ searchQuery: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Select
          value={filters.filterType}
          onValueChange={(value) => onFiltersChange({ filterType: value })}
        >
          <SelectTrigger className="w-32">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.filterPlatform}
          onValueChange={(value) => onFiltersChange({ filterPlatform: value })}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex border rounded-lg">
          <Button
            variant={filters.viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onFiltersChange({ viewMode: "grid" })}
            className="rounded-r-none"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={filters.viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onFiltersChange({ viewMode: "list" })}
            className="rounded-l-none"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
