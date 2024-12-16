"use client";
import React, { createContext, useContext, useState, useMemo } from "react";
import { toast } from "sonner";
import { TaskT } from "@/db/type";
import { CreateTaskInput } from "@/db/z-tasks";

// Define the shape of your context data
interface TaskContextType {
  tasks: TaskT[];
  getTasks: () => Promise<void>;
  updateTaskPriority: (priority: string, taskId: string) => Promise<void>;
  updateTaskStatus: (status: string, taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  createTask: (taskValues: CreateTaskInput) => Promise<void>;
}

// Create the context with a default value
export const TaskContext = createContext<TaskContextType | undefined>(
  undefined,
);

// Context Provider Component
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<TaskT[]>([]);
  // Memoized methods to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      tasks,
      getTasks: async () => {
        try {
          const response = await fetch("/api/v1/tasks");
          const data = await response.json();
          if (response.ok) {
            setTasks(data.tasks);
          }
        } catch (error) {
          throw error;
        }
      },
      updateTaskPriority: async (priority: string, taskId: string) => {
        try {
          const response = await fetch(`/api/v1/tasks/${taskId}`, {
            method: "PATCH",
            body: JSON.stringify({ priority }),
            headers: {
              "Content-type": "application/json",
            },
          });
          if (!response.ok) throw new Error("Unexpected error");

          const data = await response.json();

          setTasks((prev) =>
            prev.map((task) =>
              task.id === taskId ? (data.task as TaskT) : task,
            ),
          );
          toast.success("Status updated successfully");
        } catch (error) {
          console.error(error);
          toast.error("There has been an error, please try again later");
        }
      },
      updateTaskStatus: async (status: string, taskId: string) => {
        try {
          const response = await fetch(`/api/v1/tasks/${taskId}`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
            headers: {
              "Content-type": "application/json",
            },
          });
          if (!response.ok) throw new Error("Unexpected error");

          const data = await response.json();
          console.log(data);
          if (data.task.status === "ARCHIVED") {
            // should be removed from the DOM
            setTasks((prev) => prev.filter((task) => task.id !== taskId));
            toast.success("Task has been archived correctly");
            return;
          }
          setTasks((prev) =>
            prev.map((task) =>
              task.id === taskId ? (data.task as TaskT) : task,
            ),
          );
          toast.success("Status updated successfully");
        } catch (error) {
          console.error(error);
          toast.error("There has been an error, please try again later");
        }
      },
      deleteTask: async (taskId: string) => {
        try {
          const response = await fetch("/api/v1/tasks/" + taskId, {
            method: "DELETE",
          });
          const data = response.json();
          if (!response.ok) throw new Error("Unexpected");
          setTasks((prev) => prev.filter((task) => task.id !== taskId));
          toast.success("Task deleted successfully");
        } catch (error) {
          console.error(error);
          toast.error("There has been an error");
        }
      },
      createTask: async (taskData: CreateTaskInput) => {
        try {
          const response = await fetch("/api/v1/tasks", {
            method: "POST",
            body: JSON.stringify(taskData),
            headers: {
              "Content-type": "application/json",
            },
          });
          const data = await response.json();
          if (!response.ok) {
            if (data.error && data.message) {
              toast.error(data.error, {
                description: data.message,
              });
            } else {
              toast.error("Something went wrong");
            }
            return;
          }
          setTasks((prev) => [...prev, data.task]);
        } catch (error) {
          console.error(error);
          toast.error("There has been an error");
        }
      },
    }),
    [tasks],
  );

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
};

// Custom hook for using the context
export const useTaskContext = () => {
  const context = useContext(TaskContext);

  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }

  return context;
};
