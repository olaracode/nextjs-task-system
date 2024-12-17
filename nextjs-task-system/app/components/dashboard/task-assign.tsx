import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useUserGroupContext } from "@/contexts/UsersGroupsContext";
import { GroupT, TaskT, UserT } from "@/db/type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTaskContext } from "@/contexts/TaskContext";
import { toast } from "sonner";

type UserGroup = UserT | GroupT;

export default function TaskAssign({
  task,
  open,
  onClose,
}: {
  task: TaskT | null;
  open: boolean;
  onClose: () => void;
}) {
  const { users, groups } = useUserGroupContext();
  const { assignTask, unassign } = useTaskContext();
  const [selected, setSelected] = useState<UserGroup | undefined>();
  const [loading, setLoading] = useState(false);

  function handleAssignTask() {
    setLoading(true);
    if (!selected || !task) return;
    let isUser = "email" in selected;
    assignTask(isUser, task.id, selected.id)
      .then(() => {
        setSelected(undefined); // remove before closing the modal
        toast.success("Task assigned");
      })
      .finally(() => {
        setLoading(false);
        onClose();
      });
  }

  function handleUnassign() {
    if (!task) return;
    setLoading(true);
    unassign(task.id).finally(() => {
      setLoading(false);
      onClose();
    });
  }
  return (
    <Dialog onOpenChange={onClose} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Task</DialogTitle>
          <DialogDescription>
            Assign the task {task?.title} to:
          </DialogDescription>
          <div className="my-2 flex">
            {selected && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelected(undefined)}
              >
                {selected?.name}
                <X />
              </Button>
            )}
          </div>
        </DialogHeader>
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>
          <TabsContent value="users">
            {users &&
              users.map((user) => {
                return (
                  <p
                    onClick={() => setSelected(user)}
                    key={`task-assign-${task?.id}-${user.id}`}
                  >
                    {user.name}
                  </p>
                );
              })}
          </TabsContent>
          <TabsContent value="groups">
            {groups &&
              groups.map((group) => {
                return (
                  <p
                    onClick={() => setSelected(group)}
                    key={`task-assign-${task?.id}-${group.id}`}
                  >
                    {group.name}
                  </p>
                );
              })}
          </TabsContent>
        </Tabs>
        <DialogFooter className="sm:justify-start">
          <Button
            variant="default"
            disabled={!selected || loading}
            onClick={handleAssignTask}
          >
            Accept
          </Button>
          <Button
            variant="destructive"
            disabled={
              (!task?.assignedToGroupId && !task?.assignedToUserId) || loading
            }
            onClick={handleUnassign}
          >
            Unassign
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
