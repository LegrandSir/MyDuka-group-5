import { useState } from "react";
import { Store, Package, DollarSign, Users, BarChart3, UserPlus } from "lucide-react";
import Card from "../components/Card";
import TabButton from "../components/TabButton";
import { useMerchantDashboard } from "../hooks/useMerchantDashboard";

import MerchantOverviewSection from "../sections/MerchantOverviewSection";
import StoresSection from "../sections/StoresSection";
import PaymentsSection from "../sections/PaymentsSection";
import AdminsSection from "../sections/AdminsSection";

export default function MerchantDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const {
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
  } = useMerchantDashboard();

  if (loading) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="bg-[#041524] min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Merchant Dashboard</h1>
          <p className="text-gray-400">Manage stores, payments and admins</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card title="Stores" value={stores.length} icon={Store} color="blue" />
          <Card title="Products" value={products.length} icon={Package} color="green" />
          <Card title="Payments" value={payments.length} icon={DollarSign} color="purple" />
          <Card title="Admins" value={admins.length} icon={Users} color="orange" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-gray-800/50 p-2 rounded-xl">
          <TabButton id="overview" label="Overview" isActive={activeTab === "overview"} onClick={setActiveTab} icon={BarChart3} />
          <TabButton id="stores" label="Stores" isActive={activeTab === "stores"} onClick={setActiveTab} icon={Store} />
          <TabButton id="payments" label="Payments" isActive={activeTab === "payments"} onClick={setActiveTab} icon={DollarSign} />
          <TabButton id="admins" label="Admins" isActive={activeTab === "admins"} onClick={setActiveTab} icon={UserPlus} />
        </div>

        <div className="bg-gray-900/50 p-6 rounded-xl">
          {activeTab === "overview" && <MerchantOverviewSection stores={stores} payments={payments} />}
          {activeTab === "stores" && (
            <StoresSection
              stores={stores}
              onAdd={addStore}
              onUpdate={updateStore}
              onDelete={deleteStore}
            />
          )}
          {activeTab === "payments" && <PaymentsSection payments={payments} stores={stores} onAdd={null} showStore={true} />}
          {activeTab === "admins" && (
            <AdminsSection
              admins={admins}
              stores={stores}
              onAdd={addAdmin}
              onToggleStatus={toggleAdminStatus}
            />
          )}
        </div>
      </div>
    </div>
  );
}
