import { useEffect, useState, useCallback } from "react";
import type { Topic, Activity, Task } from "@/types/paaci";
import { seedTopics } from "@/data/seedPaaci";

const STORAGE_KEY = "paaci-2026-data-v1";

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export function usePaaci() {
  const [topics, setTopics] = useState<Topic[]>(() => {
    if (typeof window === "undefined") return seedTopics;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Topic[];
    } catch {}
    return seedTopics;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(topics));
    } catch {}
  }, [topics]);

  const addActivity = useCallback((topicId: string, data: Omit<Activity, "id" | "tasks" | "custom">) => {
    setTopics(prev => prev.map(t => t.id === topicId
      ? { ...t, activities: [...t.activities, { ...data, id: uid(), tasks: [], custom: true }] }
      : t));
  }, []);

  const updateActivity = useCallback((topicId: string, activityId: string, data: Partial<Activity>) => {
    setTopics(prev => prev.map(t => t.id === topicId
      ? { ...t, activities: t.activities.map(a => a.id === activityId ? { ...a, ...data } : a) }
      : t));
  }, []);

  const deleteActivity = useCallback((topicId: string, activityId: string) => {
    setTopics(prev => prev.map(t => t.id === topicId
      ? { ...t, activities: t.activities.filter(a => a.id !== activityId) }
      : t));
  }, []);

  const addTask = useCallback((topicId: string, activityId: string, data: Omit<Task, "id" | "createdAt">) => {
    setTopics(prev => prev.map(t => t.id === topicId
      ? {
          ...t,
          activities: t.activities.map(a => a.id === activityId
            ? { ...a, tasks: [...a.tasks, { ...data, id: uid(), createdAt: new Date().toISOString() }] }
            : a),
        }
      : t));
  }, []);

  const updateTask = useCallback((topicId: string, activityId: string, taskId: string, data: Partial<Task>) => {
    setTopics(prev => prev.map(t => t.id === topicId
      ? {
          ...t,
          activities: t.activities.map(a => a.id === activityId
            ? { ...a, tasks: a.tasks.map(tk => tk.id === taskId ? { ...tk, ...data } : tk) }
            : a),
        }
      : t));
  }, []);

  const deleteTask = useCallback((topicId: string, activityId: string, taskId: string) => {
    setTopics(prev => prev.map(t => t.id === topicId
      ? {
          ...t,
          activities: t.activities.map(a => a.id === activityId
            ? { ...a, tasks: a.tasks.filter(tk => tk.id !== taskId) }
            : a),
        }
      : t));
  }, []);

  const reset = useCallback(() => setTopics(seedTopics), []);

  return { topics, addActivity, updateActivity, deleteActivity, addTask, updateTask, deleteTask, reset };
}
