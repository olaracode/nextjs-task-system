"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { TaskPriorityValues, TaskStatusValues } from "@/db/schema";
import { Trash, Edit, Eye } from "lucide-react";
import { useTaskContext } from "@/contexts/TaskContext";
import TaskDelete from "./task-delete";
import TaskEdit from "./task-edit";
import TaskDetails from "./task-details";
import { useState } from "react";
import { TaskT } from "@/db/type";
import { formatDate } from "@/lib/utils";
import { useUserContext } from "@/contexts/UserContext";
import TaskAssign from "./task-assign";

type ActiveModal = "edit" | "delete" | "assign" | "details" | null;
export function TaskTable() {
  const { isAdmin } = useUserContext();
  const { tasks, updateTaskPriority, updateTaskStatus } = useTaskContext();
  const [openModal, setOpenModal] = useState<ActiveModal>(null);
  const [currentTask, setCurrentTask] = useState<TaskT | null>(null);

  function openDelete(task: TaskT) {
    setCurrentTask(task);
    setOpenModal("delete");
  }

  function openAssign(task: TaskT) {
    setCurrentTask(task);
    setOpenModal("assign");
  }

  function openDetails(task: TaskT) {
    setCurrentTask(task);
    setOpenModal("details");
  }

  function openEdit(task: TaskT) {
    setCurrentTask(task);
    setOpenModal("edit");
  }

  function closeModal() {
    setOpenModal(null);
    setCurrentTask(null);
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>{formatDate(task.dueDate)}</TableCell>
                <TableCell>
                  {isAdmin ? (
                    <Select
                      defaultValue={task.priority}
                      onValueChange={(value) =>
                        updateTaskPriority(value, task.id)
                      }
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(TaskPriorityValues).map(
                          (priorityValue) => {
                            return (
                              <SelectItem
                                key={`${task.id}-status-${priorityValue}`}
                                value={priorityValue}
                              >
                                {priorityValue.toLocaleLowerCase()}
                              </SelectItem>
                            );
                          },
                        )}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge>{task.priority}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {isAdmin ? (
                    <Select
                      defaultValue={task.status}
                      onValueChange={(value) =>
                        updateTaskStatus(value, task.id)
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(TaskStatusValues).map((statusValue) => {
                          return (
                            <SelectItem
                              key={`${task.id}-status-${statusValue}`}
                              value={statusValue}
                              className="capitalize"
                            >
                              {statusValue.toLowerCase()}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge>{task.status}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    disabled={!isAdmin}
                    variant="ghost"
                    onClick={() => openAssign(task)}
                  >
                    {(task.assignedToUserId &&
                      task.assignedUser &&
                      task.assignedUser.name) ||
                      (task.assignedToGroupId &&
                        task.assignedGroup &&
                        task.assignedGroup.name) ||
                      "Unassigned"}
                  </Button>
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openDetails(task)}
                  >
                    <Eye />
                  </Button>
                  {isAdmin && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEdit(task)}
                      >
                        <Edit />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openDelete(task)}
                      >
                        <Trash />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <TaskEdit
        task={currentTask}
        open={openModal === "edit"}
        onClose={closeModal}
      />
      <TaskDelete
        task={currentTask}
        open={openModal === "delete"}
        onClose={closeModal}
      />
      <TaskAssign
        task={currentTask}
        open={openModal === "assign"}
        onClose={closeModal}
      />
      <TaskDetails
        task={currentTask}
        open={openModal === "details"}
        onClose={closeModal}
      />
    </>
  );
}
