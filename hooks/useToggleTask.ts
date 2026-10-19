"use client";

import { useRef, useCallback, type Dispatch, type SetStateAction } from "react";
import toast from "react-hot-toast";
import { completeTask } from "@/lib/services/task.service";

type Toggleable = { _id: string; completed: boolean };

export function useToggleTask<T extends Toggleable>(
  setTasks: Dispatch<SetStateAction<T[]>>,
) {
  // ids with a request in flight
  const pending = useRef(new Set<string>());

  return useCallback(
    async (id: string) => {
      if (pending.current.has(id)) return;
      pending.current.add(id);

      const flip = () =>
        setTasks((prev) =>
          prev.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t)),
        );

      flip(); // optimistic: the UI changes right away

      try {
        const res = await completeTask(id);
        const done: boolean = res.data.task.completed;
        // trust the server's answer over our guess
        setTasks((prev) =>
          prev.map((t) => (t._id === id ? { ...t, completed: done } : t)),
        );
      } catch (error) {
        flip(); // undo
        toast.error("Could not update task");
        console.error("Error completing task: ", error);
      } finally {
        pending.current.delete(id);
      }
    },
    [setTasks],
  );
}