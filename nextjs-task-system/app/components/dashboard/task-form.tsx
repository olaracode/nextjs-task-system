"use client";
import { CreateTaskInput } from "@/db/z-tasks";
import React, { FormEvent, useState } from "react";
import { toast } from "sonner";

const initialData = {
  title: "",
  description: "",
  dueDate: new Date(),
  priority: "MEDIUM",
} as CreateTaskInput;
const TaskForm = () => {
  const [data, setData] = useState<CreateTaskInput>(initialData);
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/v1/tasks", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const jsonData = await response.json();
      if (!response.ok) {
        return toast.error(jsonData.error, {
          description: jsonData.message,
        });
      }
      return toast.success("Task created successfully");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }
  function onChange(e: any) {
    setData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={onChange}
          name="title"
          value={data?.title}
        />
        <input
          type="text"
          onChange={onChange}
          name="description"
          value={data?.description}
        />
        <input type="date" onChange={onChange} name="dueDate" min="today" />
        <select name="priority" onChange={onChange} value={data?.priority}>
          <option>MEDIUM</option>
        </select>
        <button type="submit" disabled={loading}>
          enviar
        </button>
      </form>
    </>
  );
};

export default TaskForm;
