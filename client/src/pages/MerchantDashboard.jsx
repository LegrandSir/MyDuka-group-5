import React, { useState, useEffect } from 'react';
import { 
  Users, Package, Store, ListTree, BarChart3, Plus, Save, Edit, Trash2, UserPlus, AlertTriangle 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import Card from "../components/Card";
import TabButton from "../components/TabButton";
import apiService, { merchantDashboard } from "../service/api";

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const MerchantDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [admins, setAdmins] = useState([]); // ⚠️ No GET /admins
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Forms
  const [newStore, setNewStore] = useState({ name: '', location: '' });
  const [newProduct, setNewProduct] = useState({ name: '', category_id: '', price: '', description: '' });
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newAdmin, setNewAdmin] = useState({ email: '', storeId: '' });

  const [showAddStore, setShowAddStore] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const storesData = await apiService.getStores();
      const productsData = await apiService.getProducts();
      const categoriesData = await apiService.getCategories();

      setStores(storesData || []);
      setProducts(productsData || []);
      setCategories(categoriesData || []);
      setAdmins([]); // ⚠️ No GET /admins
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Store
  const addStore = async () => {
    try {
      await apiService.createStore(newStore);
      await fetchDashboardData();
      setNewStore({ name: '', location: '' });
      setShowAddStore(false);
    } catch (err) {
      alert('Error creating store: ' + err.message);
    }
  };

  // Product CRUD
  const addProduct = async () => {
    try {
      await apiService.createProduct(newProduct);
      await fetchDashboardData();
      setNewProduct({ name: '', category_id: '', price: '', description: '' });
      setShowAddProduct(false);
    } catch (err) {
      alert('Error creating product: ' + err.message);
    }
  };

  const updateProduct = async () => {
    try {
      await apiService.updateProduct(editingProduct.id, editingProduct);
      await fetchDashboardData();
      setEditingProduct(null);
    } catch (err) {
      alert('Error updating product: ' + err.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await apiService.deleteProduct(id);
      await fetchDashboardData();
    } catch (err) {
      alert('Error deleting product: ' + err.message);
    }
  };

  // Category CRUD
  const addCategory = async () => {
    try {
      await apiService.createCategory(newCategory);
      await fetchDashboardData();
      setNewCategory({ name: '', description: '' });
      setShowAddCategory(false);
    } catch (err) {
      alert('Error creating category: ' + err.message);
    }
  };

  const updateCategory = async () => {
    try {
      await apiService.updateCategory(editingCategory.id, editingCategory);
      await fetchDashboardData();
      setEditingCategory(null);
    } catch (err) {
      alert('Error updating category: ' + err.message);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await apiService.deleteCategory(id);
      await fetchDashboardData();
    } catch (err) {
      alert('Error deleting category: ' + err.message);
    }
  };

  // Admin
  const addAdmin = async () => {
    try {
      await merchantDashboard.createStoreAdmin(newAdmin);
      alert('Invitation sent to ' + newAdmin.email);
      setNewAdmin({ email: '', storeId: '' });
      setShowAddAdmin(false);
    } catch (err) {
      alert('Error inviting admin: ' + err.message);
    }
  };

  // Mock data for reports
  const weeklyData = [
    { name: 'Mon', value: 12000 },
    { name: 'Tue', value: 15000 },
    { name: 'Wed', value: 18000 },
    { name: 'Thu', value: 16000 },
    { name: 'Fri', value: 22000 },
    { name: 'Sat', value: 25000 },
    { name: 'Sun', value: 20000 },
  ];

  if (loading) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="bg-[#041524] min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white">Merchant Dashboard</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card title="Total Stores" value={stores.length} icon={Store} color="blue" />
          <Card title="Products" value={products.length} icon={Package} color="green" />
          <Card title="Categories" value={categories.length} icon={ListTree} color="purple" />
          <Card title="Admins" value={admins.length} icon={Users} color="orange" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-gray-800/50 p-2 rounded-xl">
          <TabButton id="overview" label="Overview" isActive={activeTab === 'overview'} onClick={setActiveTab} icon={BarChart3} />
          <TabButton id="stores" label="Stores" isActive={activeTab === 'stores'} onClick={setActiveTab} icon={Store} />
          <TabButton id="products" label="Products" isActive={activeTab === 'products'} onClick={setActiveTab} icon={Package} />
          <TabButton id="categories" label="Categories" isActive={activeTab === 'categories'} onClick={setActiveTab} icon={ListTree} />
          <TabButton id="admins" label="Admins" isActive={activeTab === 'admins'} onClick={setActiveTab} icon={Users} />
        </div>

        <div className="bg-gray-900/50 p-6 rounded-xl">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl text-white mb-4">Performance Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <XAxis dataKey="name" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Bar dataKey="value" fill={COLORS[0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 bg-yellow-900/30 p-4 rounded text-yellow-200 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Reports not yet available from backend.
              </div>
            </div>
          )}

          {/* Stores */}
          {activeTab === 'stores' && (
            <div>
              <h2 className="text-xl text-white mb-4">Stores</h2>
              {stores.map(s => (
                <div key={s.id} className="text-gray-300 border-b border-gray-700 py-2 flex justify-between">
                  <span>{s.name} - {s.location}</span>
                  <span className="text-yellow-400 text-sm">Update/Delete missing</span>
                </div>
              ))}
              {showAddStore && (
                <div className="mt-4">
                  <input className="bg-gray-700 text-white p-2 rounded mr-2" placeholder="Name" value={newStore.name} onChange={e => setNewStore({ ...newStore, name: e.target.value })} />
                  <input className="bg-gray-700 text-white p-2 rounded mr-2" placeholder="Location" value={newStore.location} onChange={e => setNewStore({ ...newStore, location: e.target.value })} />
                  <button onClick={addStore} className="bg-green-600 px-4 py-2 rounded text-white">Add</button>
                </div>
              )}
              {!showAddStore && (
                <button onClick={() => setShowAddStore(true)} className="bg-blue-600 px-4 py-2 rounded text-white mt-4 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Store
                </button>
              )}
            </div>
          )}

          {/* Products */}
          {activeTab === 'products' && (
            <div>
              <h2 className="text-xl text-white mb-4">Products</h2>
              <table className="w-full text-gray-300">
                <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Actions</th></tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-t border-gray-700">
                      <td>{p.name}</td><td>{p.category_id}</td><td>{p.price}</td>
                      <td>
                        <button onClick={() => setEditingProduct(p)} className="text-blue-400 mr-2"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => deleteProduct(p.id)} className="text-red-400"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {showAddProduct && (
                <div className="mt-4">
                  <input className="bg-gray-700 text-white p-2 rounded mr-2" placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                  <input className="bg-gray-700 text-white p-2 rounded mr-2" placeholder="Category ID" value={newProduct.category_id} onChange={e => setNewProduct({ ...newProduct, category_id: e.target.value })} />
                  <input className="bg-gray-700 text-white p-2 rounded mr-2" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                  <button onClick={addProduct} className="bg-green-600 px-4 py-2 rounded text-white">Add</button>
                </div>
              )}
              {!showAddProduct && (
                <button onClick={() => setShowAddProduct(true)} className="bg-blue-600 px-4 py-2 rounded text-white mt-4 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              )}
              {editingProduct && (
                <div className="mt-4">
                  <input className="bg-gray-700 text-white p-2 rounded mr-2" value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} />
                  <button onClick={updateProduct} className="bg-green-600 px-4 py-2 rounded text-white">Save</button>
                </div>
              )}
            </div>
          )}

          {/* Categories */}
          {activeTab === 'categories' && (
            <div>
              <h2 className="text-xl text-white mb-4">Categories</h2>
              <table className="w-full text-gray-300">
                <thead><tr><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
                <tbody>
                  {categories.map(c => (
                    <tr key={c.id} className="border-t border-gray-700">
                      <td>{c.name}</td><td>{c.description}</td>
                      <td>
                        <button onClick={() => setEditingCategory(c)} className="text-blue-400 mr-2"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => deleteCategory(c.id)} className="text-red-400"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {showAddCategory && (
                <div className="mt-4">
                  <input className="bg-gray-700 text-white p-2 rounded mr-2" placeholder="Name" value={newCategory.name} onChange={e => setNewCategory({ ...newCategory, name: e.target.value })} />
                  <input className="bg-gray-700 text-white p-2 rounded mr-2" placeholder="Description" value={newCategory.description} onChange={e => setNewCategory({ ...newCategory, description: e.target.value })} />
                  <button onClick={addCategory} className="bg-green-600 px-4 py-2 rounded text-white">Add</button>
                </div>
              )}
              {!showAddCategory && (
                <button onClick={() => setShowAddCategory(true)} className="bg-blue-600 px-4 py-2 rounded text-white mt-4 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              )}
              {editingCategory && (
                <div className="mt-4">
                  <input className="bg-gray-700 text-white p-2 rounded mr-2" value={editingCategory.name} onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })} />
                  <button onClick={updateCategory} className="bg-green-600 px-4 py-2 rounded text-white">Save</button>
                </div>
              )}
            </div>
          )}

          {/* Admins */}
          {activeTab === 'admins' && (
            <div>
              <h2 className="text-xl text-white mb-4">Admins</h2>
              {showAddAdmin && (
                <div className="mt-4">
                  <input className="bg-gray-700 text-white p-2 rounded mr-2" placeholder="Email" value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} />
                  <input className="bg-gray-700 text-white p-2 rounded mr-2" placeholder="Store ID" value={newAdmin.storeId} onChange={e => setNewAdmin({ ...newAdmin, storeId: e.target.value })} />
                  <button onClick={addAdmin} className="bg-green-600 px-4 py-2 rounded text-white">Invite</button>
                </div>
              )}
              {!showAddAdmin && (
                <button onClick={() => setShowAddAdmin(true)} className="bg-blue-600 px-4 py-2 rounded text-white mt-4 flex items-center gap-2">
                  <UserPlus className="w-4 h-4" /> Invite Admin
                </button>
              )}
              <div className="mt-4 bg-yellow-900/30 p-4 rounded text-yellow-200 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Listing/deleting admins not available.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboard;