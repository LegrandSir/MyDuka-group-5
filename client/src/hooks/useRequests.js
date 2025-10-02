// src/hooks/useRequests.js
import { useState, useEffect } from "react";
import api from "../service/api";

export function useRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      setLoading(true);
      const data = await api.getSupplyRequests();
      setRequests(data || []);
    } catch (e) {
      console.error("useRequests fetch error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  return { requests, loading, refetch: fetch, setRequests };
}