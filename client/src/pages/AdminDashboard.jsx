import { useState } from "react";
import Card from "../components/Card";
import TabButton from "../components/TabButton";
import {
  ClipboardList,
  Package,
  DollarSign,
  UserPlus,
  AlertTriangle,
} from "lucide-react";
import { useAdminDashboard } from "../hooks/useAdminDashboard";

import OverviewSection from "../sections/OverviewSection";
import SupplyRequestsSection from "../sections/SupplyRequestsSection";
import PaymentsSection from "../sections/PaymentsSection";
import ClerksSection from "../sections/ClerksSection";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const {
    inventory,
    products,
    supplyRequests,
    payments,
    clerks,
    loading,
    addPayment,
    addClerk,
    updateRequest,
    deleteRequest,
    toggleClerkStatus,
  } = useAdminDashboard();

  if (loading) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="bg-[#041524] min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage clerks, supply requests and payments</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Inventory Items" value={inventory.length} icon={Package} color="blue" />
          <Card title="Supply Requests" value={supplyRequests.length} icon={ClipboardList} color="green" />
          <Card title="Payments" value={payments.length} icon={DollarSign} color="purple" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-gray-800/50 p-2 rounded-xl">
          <TabButton id="overview" label="Overview" isActive={activeTab === "overview"} onClick={setActiveTab} icon={ClipboardList}/>
          <TabButton id="requests" label="Supply Requests" isActive={activeTab === "requests"} onClick={setActiveTab} icon={ClipboardList}/>
          <TabButton id="payments" label="Payments" isActive={activeTab === "payments"} onClick={setActiveTab} icon={DollarSign}/>
          <TabButton id="clerks" label="Clerks" isActive={activeTab === "clerks"} onClick={setActiveTab} icon={UserPlus}/>
        </div>

        <div className="bg-gray-900/50 p-6 rounded-xl">
          {activeTab === "overview" && <OverviewSection products={products} />}
          {activeTab === "requests" && (
            <SupplyRequestsSection
              supplyRequests={supplyRequests}
              onUpdate={updateRequest}
              onDelete={deleteRequest}
            />
          )}
          {activeTab === "payments" && (
            <PaymentsSection payments={payments} onAdd={addPayment} showStore={false} />
          )}
          {activeTab === "clerks" && (
            <ClerksSection clerks={clerks} onAdd={addClerk} onToggleStatus={toggleClerkStatus} />
          )}
        </div>
      </div>
    </div>
  );
}
