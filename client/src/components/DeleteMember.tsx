"use client";

import useRemoveMember from "@/hooks/useRemoveMember";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DeleteMemberProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
}

export default function DeleteMember({
  id,
  open,
  onOpenChange,
  name,
}: DeleteMemberProps) {
  const { mutate, isPending } = useRemoveMember();
  const handleDelete = () => {
    mutate(id, {
      onSuccess: () => {
        onOpenChange(false);
      },
      onError: () => {
        onOpenChange(false);
      },
    });
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
            className="flex items-center gap-2 rounded-none bg-red-600"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Removing...
              </>
            ) : (
              "Remove"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
