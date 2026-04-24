import { useEffect, useState, useCallback } from "react";
import type { Topic, Activity, Task } from "@/types/paaci";
import { supabase } from "@/integrations/supabase/client";

export function usePaaci() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPaaciData = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('paaci_topics')
        .select(`
          id, title,
          activities:paaci_activities(
            id, title, description,
            tasks:paaci_tasks(*)
          )
        `);

      if (error) {
        console.error("Erro na consulta do Supabase:", error.message);
        throw error;
      }

    }
    
      setTopics(data || []);
    } catch (error) {
      console.error("Erro ao carregar PAACI:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(async (topicId: string, activityId: string, data: Omit<Task, "id" | "createdAt">) => {
    try {
      const { error } = await supabase
        .from('paaci_tasks')
        .insert([{ ...data, activity_id: activityId }]);

      if (error) throw error;
      fetchPaaciData(); // Recarrega os dados para atualizar a tela
    } catch (error) {
      alert("Erro ao salvar tarefa no banco.");
    }
  }, [fetchPaaciData]);

  const updateTask = useCallback(async (topicId: string, activityId: string, taskId: string, data: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('paaci_tasks')
        .update(data)
        .eq('id', taskId);

      if (error) throw error;
      fetchPaaciData();
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  }, [fetchPaaciData]);

  const deleteTask = useCallback(async (topicId: string, activityId: string, taskId: string) => {
    try {
      const { error } = await supabase
        .from('paaci_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      fetchPaaciData();
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  }, [fetchPaaciData]);

  const reset = useCallback(() => {
    alert("Função de reset desativada para proteger o banco de dados real.");
  }, []);

  return { 
    topics,
    loading,
    addTask,
    updateTask, 
    deleteTask, 
    reset,
    refresh: fetchPaaciData // Permite atualizar manualmente
  };
}
