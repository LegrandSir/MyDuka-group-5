// src/hooks/useCategories.js
import { useState, useEffect } from "react";
import api from "../service/api";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      setLoading(true);
      const data = await api.getCategories();
      setCategories(data || []);
    } catch (e) {
      console.error("useCategories fetch error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  return { categories, loading, refetch: fetch, setCategories };
}