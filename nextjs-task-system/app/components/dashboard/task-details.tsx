import React, { useEffect } from "react";
import { TaskT } from "@/db/type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
export default function TaskDetails({
  task,
  open,
  onClose,
}: {
  task: TaskT | null;
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!task) return; // if it doesn't exist don't do anything
    if (task.comments) return; // if they have comments don't do anything
    // TODO -> Fetch task comments
  }, [task]);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
          <DialogDescription>{task?.description}</DialogDescription>
        </DialogHeader>
        <form>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
