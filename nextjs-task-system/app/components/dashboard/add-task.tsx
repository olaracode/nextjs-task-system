"use client";
import React, { useActionState } from "react";
import { createTask } from "@/actions/task";
import { toast } from "sonner";
interface TaskState {
  title?: string;
  description?: string;
  date?: string;
  dueDate?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  errors?: {
    title?: string[];
    description?: string[];
    dueDate?: string[];
    priority?: string[];
  };
  error?: string;
}
const initialState: TaskState = {
  title: "",
  description: "",
  dueDate: "",
  priority: "MEDIUM",
};

export default function AddTask() {
  const [state, formAction, pending] = useActionState(createTask, initialState);
  React.useEffect(() => {
    if (state.error) {
      toast.error("There has been an error", {
        description: state.error,
      });
    }
  }, [state.error]);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {/* Display any validation errors */}
      {state.errors && (
        <div>
          {state.errors.title && <p>{state.errors.title}</p>}
          {state.errors.description && <p>{state.errors.description}</p>}
        </div>
      )}

      <input name="title" placeholder="Task Title" defaultValue={state.title} />
      <input
        name="description"
        placeholder="Description"
        defaultValue={state.description}
      />
      <input name="dueDate" type="date" defaultValue={state.dueDate} />
      <select name="priority" defaultValue={state.priority}>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>
      <button type="submit" disabled={pending}>
        {pending ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}
