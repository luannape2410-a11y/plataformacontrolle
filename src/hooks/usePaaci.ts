import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePaaci() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPaaciData = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('paaci_topics')
        .select('*');

      if (error) throw error;
      setTopics(data || []);
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPaaciData();
  }, [fetchPaaciData]);

  return { 
    topics, 
    loading, 
    addTask: async () => {}, 
    updateTask: async () => {}, 
    deleteTask: async () => {}, 
    reset: () => {}, 
    refresh: fetchPaaciData 
  };
}
