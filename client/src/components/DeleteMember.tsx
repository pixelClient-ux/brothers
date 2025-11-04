"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteMemberProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => void;
  name: string;
}

export default function DeleteMember({
  id,
  open,
  onOpenChange,
  onDelete,
  name,
}: DeleteMemberProps) {
  const handleDelete = () => {
    onDelete(id);
    onOpenChange(false); // Close the dialog after deletion
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-gray-700 bg-[#111827] text-white">
        <DialogHeader>
          <DialogTitle>Remove Member</DialogTitle>
        </DialogHeader>

        <p className="mt-2 text-gray-300">
          Are you sure you want to remove
          <span className="text-primary font-bold"> {name}</span> from the
          membership? This action cannot be undone.
        </p>

        <DialogFooter className="flex justify-end gap-2 pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-none text-black"
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="rounded-none bg-red-600"
            onClick={handleDelete}
          >
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
