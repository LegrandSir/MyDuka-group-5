import { useState, useEffect } from "react";
import api, { merchantDashboard } from "../service/api";

export function useMerchantDashboard() {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all dashboard data
  const fetchAll = async () => {
    try {
      setLoading(true);
      const [s, p, pay] = await Promise.all([
        api.getStores(),
        api.getProducts(),
        api.getPayments(),
        // merchantDashboard.getAdmins() // enable if backend supports
      ]);
      setStores(s || []);
      setProducts(p || []);
      setPayments(pay || []);
      // setAdmins(adminsData || []);
    } catch (err) {
      console.error("Error fetching merchant dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Stores CRUD
  const addStore = async (store) => {
    await api.createStore(store);
    fetchAll();
  };

  const updateStore = async (id, data) => {
    await api.updateStore(id, data);
    fetchAll();
  };

  const deleteStore = async (id) => {
    await api.deleteStore(id);
    fetchAll();
  };

  // Admins
  const addAdmin = async (admin) => {
    await merchantDashboard.createStoreAdmin(admin);
    fetchAll();
  };

  const toggleAdminStatus = async (id, active) => {
    await merchantDashboard.toggleAdminStatus(id, active);
    fetchAll();
  };

  return {
    stores,
    products,
    payments,
    admins,
    loading,
    addStore,
    updateStore,
    deleteStore,
    addAdmin,
    toggleAdminStatus,
  };
}
