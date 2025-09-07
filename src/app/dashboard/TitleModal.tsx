"use client";
import { useState, useEffect } from "react"; // Add useEffect
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";

interface TitlePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  defaultTitle?: string;
}

export function TitlePromptModal({
  isOpen,
  onClose,
  onSave,
  defaultTitle = "",
}: TitlePromptModalProps) {
  const [title, setTitle] = useState(defaultTitle); // Initialize with defaultTitle

  // Reset the title when the modal opens with a new defaultTitle
  useEffect(() => {
    if (isOpen) {
      setTitle(defaultTitle);
    }
  }, [isOpen, defaultTitle]);

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim());
      setTitle("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save to Library</DialogTitle>
          <DialogDescription>
            Give your content a title to save it to your library.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your content"
              onKeyPress={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title.trim()}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
