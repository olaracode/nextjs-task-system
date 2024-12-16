"use client";
import React, { useEffect, useState } from "react";
import { TaskTable } from "./task-table";
import { TaskT } from "@/db/type";
import { NewTaskModal } from "./new-task-modal";
import { toast } from "sonner";
import { useTaskContext } from "@/contexts/TaskContext";
export default function Dashboard() {
  const { getTasks } = useTaskContext();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getTasks().finally(() => setLoading(false));
  }, []);
  return (
    <div>
      <div className="mb-5">
        <NewTaskModal />
      </div>
      {loading ? <p>Loading...</p> : <TaskTable />}
    </div>
  );
}
