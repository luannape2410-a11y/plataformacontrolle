import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePaaci() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPaaciData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('paaci_topics')
      .select('id, title, activities:paaci_activities(id, title, description, tasks:paaci_tasks(*))');
    
    if (!error && data) {
      setTopics(data);
    }
    setLoading(false);
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
