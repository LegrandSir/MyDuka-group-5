// src/pages/ClerkDashboard.jsx
import React, { useState } from "react";
import { Package, ClipboardList, ListTree, AlertTriangle, FileStack } from "lucide-react";
import Card from "../components/Card";
import TabButton from "../components/TabButton";

import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useInventory } from "../hooks/useInventory";
import { useRequests } from "../hooks/useRequests";

import ProductsSection from "../sections/ProductsSection";
import CategoriesSection from "../sections/CategoriesSection";
import InventorySection from "../sections/InventorySection";
import RequestsSection from "../sections/RequestsSection";

import api from "../service/api";

export default function ClerkDashboard() {
  const { products, refetch: refetchProducts } = useProducts();
  const { categories, refetch: refetchCategories } = useCategories();
  const { inventory, refetch: refetchInventory } = useInventory();
  const { requests, refetch: refetchRequests } = useRequests();

  const [activeTab, setActiveTab] = useState("overview");


  const refreshAll = async () => {
    await Promise.all([refetchProducts(), refetchCategories(), refetchInventory(), refetchRequests()]);
  };

  return (
    <div className="bg-[#041524] min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Clerk Dashboard</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card title="Inventory Items" data-testid="kpi-inventory" value={inventory.length} icon={Package} color="blue" />
          <Card title="Categories" data-testid="kpi-category" value={categories.length} icon={ListTree} color="purple" />
          <Card title="Requests" data-testid="kpi-request" value={requests.length} icon={ClipboardList} color="green" />
          <Card title="Pending Requests" data-testid="kpi-pending" value={requests.filter(r => r.status === "pending").length} icon={AlertTriangle} color="yellow" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-gray-800/50 p-2 rounded-xl">
          <TabButton id="overview" label="Overview" isActive={activeTab === "overview"} onClick={setActiveTab} icon={Package} />
          <TabButton id="products" label="Products" isActive={activeTab === "products"} onClick={setActiveTab} icon={Package} />
          <TabButton id="category" label="Category" isActive={activeTab === "category"} onClick={setActiveTab} icon={FileStack} />
          <TabButton id="inventory" label="Inventory" isActive={activeTab === "inventory"} onClick={setActiveTab} icon={Package} />
          <TabButton id="requests" label="Requests" isActive={activeTab === "requests"} onClick={setActiveTab} icon={ClipboardList} />
        </div>

        {/* Content */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
          {activeTab === "overview" && (
            <div>
              <h2 className="text-xl text-white mb-4">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Total Products</div>
                  <div className="text-2xl font-bold text-white">{products.length}</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Low Stock Items</div>
                  <div className="text-2xl font-bold text-red-400">{inventory.filter(i => i.quantity < 10).length}</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Pending Requests</div>
                  <div className="text-2xl font-bold text-yellow-400">{requests.filter(r => r.status === 'pending').length}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <ProductsSection products={products} categories={categories} getCurrentStock={(id) => inventory.find(i => i.product_id === id)?.quantity || 0} onProductsChange={refetchProducts} />
          )}

          {activeTab === "category" && (
            <CategoriesSection categories={categories} products={products} onCategoriesChange={refetchCategories} />
          )}

          {activeTab === "inventory" && (
            <InventorySection inventory={inventory} products={products} categories={categories} onInventoryChange={refetchInventory} />
          )}

          {activeTab === "requests" && (
            <RequestsSection requests={requests} products={products} onRequestsChange={refetchRequests} />
          )}
        </div>
      </div>
    </div>
  );
}
