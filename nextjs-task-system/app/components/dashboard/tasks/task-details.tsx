"use client";
import React, { FormEvent, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTaskContext } from "@/contexts/TaskContext";
import TaskCommentCreate from "./task-comment-create";
import TaskComment, { CommentSkeleton } from "./task-comment";
export default function TaskDetails({
  taskId,
  open,
  onClose,
}: {
  taskId: string | undefined;
  open: boolean;
  onClose: () => void;
}) {
  const { getTaskComments, tasks } = useTaskContext();
  const [loading, setLoading] = useState(true);
  const task = tasks.find((t) => t.id === taskId);

  useEffect(() => {
    if (!taskId || !task) return; // if it doesn't exist don't do anything
    if (task.comments) return;
    setLoading(true);
    getTaskComments(task.id).finally(() => setLoading(false));
  }, [task]);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto transition-all duration-300 ease-in-out">
        <DialogHeader>
          <DialogTitle>Task Details: {task?.title}</DialogTitle>
          <DialogDescription>{task?.description}</DialogDescription>
        </DialogHeader>
        <TaskCommentCreate taskId={task?.id} />
        {/* TODO -> Comment rendering */}
        <div className="flex flex-col-reverse">
          {loading ? (
            <CommentSkeleton />
          ) : task?.comments && task.comments.length > 0 ? (
            task.comments.map((comment) => {
              return (
                <TaskComment
                  key={comment.id}
                  author={comment.user?.name!}
                  content={comment.content}
                  avatar={comment.user?.image!}
                  createdAt={`${comment.createdAt}`}
                />
              );
            })
          ) : (
            <p>No comments created yet</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
