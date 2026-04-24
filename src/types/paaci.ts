import { useState } from "react";

export function usePaaci() {
  const [topics] = useState([]);
  return { 
    topics, 
    loading: false, 
    addTask: async () => {}, 
    updateTask: async () => {}, 
    deleteTask: async () => {}, 
    reset: () => {}, 
    refresh: async () => {} 
  };
}
