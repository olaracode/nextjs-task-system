"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { TaskPriorityValues, TaskStatusValues } from "@/db/schema";
import { Trash, Edit } from "lucide-react";
import { useTaskContext } from "@/contexts/TaskContext";
export function TaskTable() {
  const { tasks, updateTaskPriority, updateTaskStatus, deleteTask } =
    useTaskContext();

  const formatDate = (date: string) => {
    const fDate = new Date(date);
    return `${fDate.getDate()}/${fDate.getMonth() + 1}/${fDate.getFullYear()}`;
  };

  return (
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
              <TableCell>{formatDate(`${task.dueDate}`)}</TableCell>
              <TableCell>
                <Select
                  defaultValue={task.priority}
                  onValueChange={(value) => updateTaskPriority(value, task.id)}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(TaskPriorityValues).map((priorityValue) => {
                      return (
                        <SelectItem
                          key={`${task.id}-status-${priorityValue}`}
                          value={priorityValue}
                        >
                          {priorityValue.toLocaleLowerCase()}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  defaultValue={task.status}
                  onValueChange={(value) => updateTaskStatus(value, task.id)}
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
              </TableCell>
              <TableCell>
                {task.assignedToUserId ||
                  task.assignedToGroupId ||
                  "Unassigned"}
              </TableCell>
              <TableCell className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Edit />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
