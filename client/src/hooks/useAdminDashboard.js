import { useState, useEffect } from "react";
import apiService, { adminDashboard } from "../service/api";
import { useAuth } from "../context/AuthContext";

export function useAdminDashboard() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [supplyRequests, setSupplyRequests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [clerks, setClerks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [inv, prod, req, pay] = await Promise.all([
        apiService.getInventory(),
        apiService.getProducts(),
        apiService.getSupplyRequests(),
        apiService.getPayments(),
      ]);
      setInventory(inv || []);
      setProducts(prod || []);
      setSupplyRequests(req || []);
      setPayments(pay || []);
      // setClerks(await adminDashboard.getClerks() || []);
    } catch (err) {
      console.error("Error fetching admin dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const addClerk = async (clerk) => {
    await apiService.createClerkViaAdmin(clerk);
    fetchAll();
  };

  const addPayment = async (payment) => {
    await apiService.createPayment({ ...payment, user_id: user?.id });
    fetchAll();
  };

  const updateRequest = async (id, status) => {
    await api.updateSupplyRequest(id, status);
    fetchAll();
  };

  const deleteRequest = async (id) => {
    await api.request(`/supply_requests/${id}`, { method: "DELETE" });
    fetchAll();
  };

  const toggleClerkStatus = async (id, active) => {
    await adminDashboard.toggleClerkStatus(id, active);
    fetchAll();
  };

  return {
    inventory,
    products,
    supplyRequests,
    payments,
    clerks,
    loading,
    addClerk,
    addPayment,
    updateRequest,
    deleteRequest,
    toggleClerkStatus,
  };
}