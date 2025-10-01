// src/hooks/useInventory.js
import { useState, useEffect } from "react";
import api from "../service/api";

export function useInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      setLoading(true);
      const data = await api.getInventory();
      setInventory(data || []);
    } catch (e) {
      console.error("useInventory fetch error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  return { inventory, loading, refetch: fetch, setInventory };
}