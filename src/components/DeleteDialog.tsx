import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/card";
import { Button } from "@/components/button";
import { LibraryItem } from "@/types/library";

interface DeleteDialogProps {
  isOpen: boolean;
  itemToDelete: LibraryItem | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteDialog({
  isOpen,
  itemToDelete,
  onConfirm,
  onCancel,
}: DeleteDialogProps) {
  if (!isOpen || !itemToDelete) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-96">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
          </div>
          <p className="text-muted-foreground mb-6">
            Are you sure you want to delete &quot;{itemToDelete.title}
            &quot;? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
