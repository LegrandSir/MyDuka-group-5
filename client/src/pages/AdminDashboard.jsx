import { useState, useEffect } from 'react';
import {  Users, ShoppingCart, Package, Plus, DollarSign, FileText, Edit, Trash2, UserPlus, ListTree, Calendar, TrendingUp, AlertTriangle, Save, XCircle } from 'lucide-react';
import Card from "../components/Card";
import TabButton from "../components/TabButton";
import apiService from "../service/api";
import { adminDashboard } from "../service/api";

// Removed dummy initial arrays; will load real data from backend

const  AdminDashboard = (user) => {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [supplyRequests, setSupplyRequests] = useState([]);

  const [loading, setLoading] = useState(true); 

  const [activeTab, setActiveTab] = useState('inventory');
  const [reqs, setReqs] = useState([]);
  const [clerks, setClerks] = useState([]);
  const [payments, setPayments] = useState([]);
  const [clerkReports] = useState([]);
  
  const [editingItem, setEditingItem] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null); 

  const [newClerk, setNewClerk] = useState({ name: '', email: '', password: '' });
  const [newProduct, setNewProduct] = useState({ name: '', stock: '', price: '', supplier: '', category: '', reorderLevel: '', barcode: '' });
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

  const [newRequest, setNewRequest] = useState({ product_id: null, store_id: null, quantity: null, requested_by: null });
  const [receiveItem, setReceiveItem] = useState({ product_id: null, quantity: '' });

  const [showAddClerk, setShowAddClerk] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddRequest, setShowAddRequest] = useState(false);
  // Re-added 'editingProduct' and kept 'editingCategory' together
  const [editingProduct, setEditingProduct] = useState(null); 
  // const [editingCategory, setEditingCategory] = useState(null); // Duplicated line from before, removing one

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const act = (id, s) => setReqs(reqs.map(r => r.id === id ? { ...r, status: s } : r));
  const updatePaymentStatus = (id, status) => {
    setPayments(payments.map(p => 
      p.id === id ? { 
        ...p, 
        status, 
        paidDate: status === 'paid' ? new Date().toISOString().split('T')[0] : undefined 
      } : p
    ));
  };

  useEffect(() => {
      const fetchInventory = async () => {
        try {
          const data = await adminDashboard.getInventoryOverview(user.id);
          setInventory(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Failed to load inventory", err);
        } finally {
          setLoading(false);
        }
      };
      fetchInventory();
    }, [user.id]);
  const updateInventory = async (id, field, value) => {
    // Placeholder implementation since clerkDashboard.recordSpoilage seems to be the only update function
    // You likely need a dedicated clerkDashboard.updateInventory(id, { [field]: value });
    console.log(`Updating inventory item ${id}: ${field} to ${value}`);
    // await clerkDashboard.updateInventory(id, { [field]: value }); 
    setInventory((prev) =>
        prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };
  
    const submitRequest = async () => {
    const { product_id, store_id, quantity, requested_by } = newRequest;
 if (!product_id || !store_id || !quantity || !requested_by) {
      alert("Please fill all required fields: Product ID, Store ID, Quantity, and Your User ID.");
 return;
    }
    
    try {
      const created = await apiService.createSupplyRequest({
        product_id,
        store_id,
        quantity,
        requested_by,
      });
      setSupplyRequests((prev) => [...prev, created]);
      setReqs((prev) => [...prev, created]);
      setNewRequest({ product_id: null, store_id: null, quantity: null, requested_by: null });
      alert('Supply request submitted successfully!');
 } catch (err) {
      console.error("Failed to submit supply request", err);
 alert("Error submitting request. Check console for details.");
    }
  };
 // Handle clerk management
  const toggleClerkStatus = (id) => {
    setClerks(clerks.map(c => 
      c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c
    ));
 };

  const deleteClerk = (id) => {
    if (window.confirm('Are you sure you want to delete this clerk?')) {
      setClerks(clerks.filter(c => c.id !== id));
 }
  };

  const addClerk = () => {
    if (!newClerk.name || !newClerk.email) return;
 const clerk = {
      id: Date.now(),
      name: newClerk.name,
      email: newClerk.email,
      status: 'active',
      storeId: user.storeId,//////////////**** */
      lastActive: new Date().toISOString().split('T')[0],
      entriesCount: 0
    };
 setClerks([...clerks, clerk]);
    setNewClerk({ name: '', email: '', password: '' });
    setShowAddClerk(false);
  };
 useEffect(() => {
   const fetchAll = async () => {
     try {
       const [productsData, categoriesData, requestsData] = await Promise.all([
         apiService.getProducts(),
         apiService.getCategories(),
         apiService.getSupplyRequests(),
       ]);
       setProducts(Array.isArray(productsData) ? productsData : []);
       setCategories(Array.isArray(categoriesData) ? categoriesData : []);
       setSupplyRequests(Array.isArray(requestsData) ? requestsData : []);
       setReqs(Array.isArray(requestsData) ? requestsData : []);
     } catch (err) {
       console.error("Failed to load dashboard data", err);
     }
   };

   fetchAll();
 }, []);

  const addInventory = async () => {
    if (!receiveItem.product_id || !receiveItem.quantity) return;
    try {
      await apiService.addInventory(receiveItem.product_id, parseInt(receiveItem.quantity));
      const data = await apiService.getInventory();
      setInventory(Array.isArray(data) ? data : []);
      setReceiveItem({ product_id: null, quantity: '' });
      alert('Items received and inventory updated.');
    } catch (e) {
      console.error('Failed to add inventory', e);
      alert('Error receiving items');
    }
  };
  // Auto-fill store_id and requested_by from user prop
  useEffect(() => {
    setNewRequest((prev) => ({
      ...prev,
      store_id: prev.store_id ?? user.storeId ?? null,
      requested_by: prev.requested_by ?? user.id ?? null,
    }));
  }, [user.storeId, user.id]);

  // Default product_id to first product once products load
  useEffect(() => {
    if (!newRequest.product_id && products.length > 0) {
      setNewRequest((prev) => ({ ...prev, product_id: products[0].id }));
    }
  }, [products, newRequest.product_id]);
 // Update product locally and backend
  const updateProduct = async (id, field, value) => {
    try {
      const updated = products.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      );
 setProducts(updated);

      const product = updated.find((p) => p.id === id);
      // Note: apiService is used here, ensure it's imported correctly
      await apiService.updateProduct(id, product);
 } catch (err) {
      console.error("Failed to update product", err);
    }
  };
 // Delete product
  const deleteProduct = async (id) => {
  try {
    // Note: apiService is used here, ensure it's imported correctly
    await apiService.deleteProduct(id);
 setInventory(inventory.filter(item => item.id !== id));
  } catch (error) {
    console.error("Failed to delete product:", error);
    alert("Error deleting product");
 }
};

  // Category CRUD operations
  // Handle category updates
    const updateCategory = (id, field, value) => {
      setCategories(categories.map(cat => 
        cat.id === id ? { ...cat, [field]: value } : cat
      ));
 };
  
    // Add new category
    const addCategory = async () => {
    if (!newCategory.name) return;
 try {
      // Note: apiService is used here, ensure it's imported correctly
      const category = await apiService.createCategory(
        newCategory.name,
        newCategory.description
      );
 setCategories([...categories, category]); 
      setNewCategory({ name: "", description: "" });
    } catch (error) {
      console.error("Failed to add category:", error);
 alert("Error adding category");
    }
  };
  
  
    // Delete category
    const deleteCategory = async (id) => {
    const hasProducts = inventory.some(
      item => item.category === categories.find(cat => cat.id === id)?.name
    );
 if (hasProducts) {
      alert("Cannot delete category with existing products");
      return;
 }
  
    try {
      // Note: apiService is used here, ensure it's imported correctly
      await apiService.deleteCategory(id);
      setCategories(categories.filter(cat => cat.id !== id));
 } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Error deleting category");
    }
  };
 // Calculate metrics
  const pendingRequests = reqs.filter(r => r.status === 'pending').length;
  const unpaidPayments = payments.filter(p => p.status === 'unpaid' || p.status === 'overdue').length;
  const activeClerks = clerks.filter(c => c.status === 'active').length;
  const lowStockProducts = inventory.filter(i => typeof i.quantity === 'number' && i.quantity <= 10).length;

  return (
    <div className="bg-[#041524] backdrop-blur-md border border-gray-900 rounded-2xl p-6 shadow-2xl">
    <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage requests, payments, clerks, and view reports</p>
        </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
     
    <Card title="Total Products" value={products.length} icon={Package} color="blue" />
        <Card title="Low Stock Items" value={lowStockProducts} icon={AlertTriangle} color="red" />
        <Card title="Pending Requests" value={pendingRequests} icon={ShoppingCart} color="yellow" />
        <Card title="Unpaid Suppliers" value={unpaidPayments} icon={DollarSign} color="orange" />
        <Card title="Active Clerks" value={activeClerks} icon={Users} color="green" />
    </div>


      {/* <div className="bg-[#041524] backdrop-blur-md border border-gray-900 rounded-2xl p-6 shadow-2xl"> */}
    <div className="flex flex-wrap gap-2 bg-gray-800/50 p-2 rounded-xl backdrop-blur-sm">
    
    <TabButton id="inventory" label="Display Inventory" isActive={activeTab === 'inventory'} onClick={setActiveTab} icon={Package} />
        <TabButton id="categories" label="List Categories" isActive={activeTab === 'categories'} onClick={setActiveTab} icon={ListTree} />
        <TabButton id="requests" label="Supply Requests" isActive={activeTab === 'requests'} onClick={setActiveTab} icon={ShoppingCart} />
        <TabButton id="receive" label="Receive Items" isActive={activeTab === 'receive'} onClick={setActiveTab} icon={Package} />
        <TabButton id="reports" label="Clerk Reports" isActive={activeTab === 'reports'} onClick={setActiveTab} icon={FileText} />
        <TabButton id="payments" label="Supplier Payments" isActive={activeTab === 'payments'} onClick={setActiveTab} icon={DollarSign} />
        <TabButton id="clerks" label="Manage Clerks" isActive={activeTab === 'clerks'} onClick={setActiveTab} icon={Users} />
  
  </div>

        {/* Tab Content */}
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
          
        {/* Supply Requests Tab */}
      {activeTab === 'inventory' && (
    <div>
        <h2 className="text-xl font-semibold text-white mb-6">Inventory Overview</h2>
        
        <div className="overflow-x-auto">
            <table className="w-full text-gray-300">
     
            <thead className="bg-gray-800 text-gray-200">
                    <tr>
                        <th className="p-3 text-left">ID</th> 
                        <th className="p-3 text-left">Product Name</th>
             
            <th className="p-3 text-left">Product ID</th>
                        <th className="p-3 text-left">Quantity</th>
                        <th className="p-3 text-left">Last Updated</th>
                        <th className="p-3 text-left">Actions</th>
       
              </tr>
                </thead>
                <tbody>
                    {inventory.map(item => (
                        <tr key={item.id} className="border-t border-gray-700 hover:bg-gray-800/50">
     
                        <td className="p-3 font-medium">{item.id}</td>
                            <td className="p-3 font-medium">{item.product_name}</td>
                            <td className="p-3">{item.product_id}</td>
                
             
                            <td className="p-3">
                                {editingItem === item.id ?
 (
                                    <input
                                        type="number"
                        
                 value={item.quantity}
                                        onChange={(e) => updateInventory(item.id, 'quantity', parseInt(e.target.value))}
                                        
 className="w-16 px-2 py-1 bg-gray-700 rounded text-white text-sm"
                                    />
                                ) : (
                        
             <span className={`${item.quantity < 10 ? 'text-red-400' : 'text-green-400'}`}>
                                        {item.quantity}
                                    </span>
     
                           )}
                            </td>

                            <td className="p-3">{new Date(item.updated_at).toLocaleDateString()}</td> 
              
               
                            <td className="p-3">
                                {editingItem === item.id ?
 (
                                    <button
                                        onClick={() => setEditingItem(null)}
                      
                   className="text-green-400 hover:text-green-300"
                                    >
                                        <Save className="w-4 h-4" />
  
                                    </button>
                                ) : (
                                
     <button
                                        onClick={() => setEditingItem(item.id)}
                                        className="text-blue-400 hover:text-blue-300"
             
                        >
                                        <Edit className="w-4 h-4" />
                                  
   </button>
                                )}
                            </td>
                        </tr>
              
        ))}
                </tbody>
            </table>
        </div>
    </div>
  )}

        
    {activeTab === 'products' && (
    <div>
        <h2 className="text-xl font-semibold text-white mb-6">Manage Products</h2>
        <div className="overflow-x-auto">
          
    <table className="w-full text-gray-300">
                <thead className="bg-gray-800 text-gray-200">
                    <tr>
                        <th className="p-3 text-left">Product Name</th>
                        <th className="p-3 text-left">Category</th>
     
                    <th className="p-3 text-left">Price (Ksh)</th> 
                        <th className="p-3 text-left">Actions</th>
                    </tr>
                </thead>
               
  <tbody>
                    {products.map((item) => (
                        <tr key={item.id} className="border-t border-gray-700 hover:bg-gray-800/50">
                            
                     
            {/* Product name */}
                            <td className="p-3">
                                {editingItem === item.id ?
 (
                                    <input
                                        type="text"
                        
                 value={item.name}
                                        onChange={(e) => updateProduct(item.id, "name", e.target.value)}
                                        
 className="w-full px-2 py-1 bg-gray-700 rounded text-white text-sm"
                                    />
                                ) : (
                        
             <span className="font-medium">{item.name}</span>
                                )}
                            </td>

                           
  <td className="p-3">
                                {editingItem === item.id ?
 (
                                    <select
                                        value={item.category_id} 
                       
                  onChange={(e) => updateProduct(item.id, "category_id", parseInt(e.target.value))} 
                                        className="w-full px-2 py-1 bg-gray-700 rounded text-white text-sm"
                                
     >
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
        
                                        ))}
                                    </select>
                                
 ) : (
                                    <span className="text-sm text-gray-400">{item.category_name}</span>
                                )}
                            
 </td>

                            <td className="p-3">
                                {editingItem === item.id ?
 (
                                    <input
                                        type="number"
                        
                 value={item.price} 
                                        onChange={(e) => updateProduct(item.id, "price", parseFloat(e.target.value))}
                                       
  className="w-20 px-2 py-1 bg-gray-700 rounded text-white text-sm"
                                    />
                                ) : (
                       
              `Ksh ${item.price}`
                                )}
                            </td>

                          
    {/* Actions */}
                            <td className="p-3">
                                <div className="flex gap-2">
                                 
    {editingItem === item.id ? (
                                        <button
                                            onClick={() => setEditingItem(null)} 
      
                                        className="text-green-400 hover:text-green-300"
                                        >
                     
                        Save
                                        </button>
                                    ) 
 : (
                                        <button
                                            onClick={() => setEditingItem(item.id)}
             
                                 className="text-blue-400 hover:text-blue-300"
                                        >
                            
                 Edit
                                        </button>
                                    )}
        
                             <button
                                        onClick={() => deleteProduct(item.id)}
                              
           className="text-red-400 hover:text-red-300"
                                    >
                                        Delete
             
                        </button>
                                </div>
                            </td>
                 
        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
   )}

    {activeTab === 'categories' && (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Manage Categories</h2>
      <div 
 className="bg-gray-800/50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-white mb-4">Add New Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Category Name</label>
            <input
              type="text"
              value={newCategory.name}
    
              onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              placeholder="Enter category name"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Description</label>
 
            <input
              type="text"
              value={newCategory.description}
              onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              placeholder="Enter description"
       
          />
          </div>
        </div>
        <button
          onClick={addCategory}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
       
  </button>
      </div>

      {/* Categories List */}
      <div className="overflow-x-auto">
        <table className="w-full text-gray-300">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="p-3 text-left">Category Name</th>
              <th className="p-3 text-left">Description</th>
          
      <th className="p-3 text-left">Products Count</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id} className="border-t border-gray-700 hover:bg-gray-800/50">
             
    <td className="p-3">
                  {editingCategory === category.id ?
 (
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
          
             className="w-full px-2 py-1 bg-gray-700 rounded text-white text-sm"
                    />
                  ) : (
                    <span className="font-medium">{category.name}</span>
                  )}
   
              </td>
                <td className="p-3">
                  {editingCategory === category.id ?
 (
                    <input
                      type="text"
                      value={category.description}
                      onChange={(e) => updateCategory(category.id, 'description', e.target.value)}
          
             className="w-full px-2 py-1 bg-gray-700 rounded text-white text-sm"
                    />
                  ) : (
                    <span className="text-gray-400">{category.description}</span>
                  )}
   
              </td>
                
                <td className="p-3">
                  <span className="text-blue-400">
                    {category.products ?
 category.products.length : 0} 
                  </span>
                </td>
                
                <td className="p-3">
                  <div className="flex gap-2">
          
            {editingCategory === category.id ?
 (
                      <button
                        onClick={() => setEditingCategory(null)} 
                        className="text-green-400 hover:text-green-300"
                      >
    
                      <Save className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
           
              onClick={() => setEditingCategory(category.id)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit className="w-4 h-4" />
           
            </button>
                    )}
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="text-red-400 hover:text-red-300"
  
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </td>
   
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
   )}

          {activeTab === 'requests' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Submit Supply 
 Request</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Product</label>
                  <select
                    value={newRequest.product_id || ''}
                    onChange={(e) => setNewRequest({ ...newRequest, product_id: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Requested Quantity</label>
                         <input
     
                           type="number"
                            value={newRequest.quantity ||
 ''}
                            onChange={(e) => setNewRequest({...newRequest, quantity: parseInt(e.target.value)})}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                            placeholder="Enter quantity needed"
   
                        />
                        </div>

                        <div>
                          <label className="block text-gray-300 text-sm mb-2">Store</label>
                          <input
                            type="text"
                            value={newRequest.store_id || ''}
                            readOnly
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-300 text-sm mb-2">Requested By</label>
                          <input
                            type="text"
                            value={newRequest.requested_by || ''}
                            readOnly
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
                          />
                        </div>

              </div>
              
              <button
          
           onClick={submitRequest}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                Submit Request
              </button>
     
        </div>
        )}
        {activeTab === 'receive' && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Receive Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Product</label>
                <select
                  value={receiveItem.product_id || ''}
                  onChange={(e) => setReceiveItem({ ...receiveItem, product_id: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Quantity Received</label>
                <input
                  type="number"
                  value={receiveItem.quantity}
                  onChange={(e) => setReceiveItem({ ...receiveItem, quantity: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  placeholder="Enter quantity"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={addInventory}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Receive Items
                </button>
              </div>
            </div>
          </div>
        )}
          </div>
        </div>
      </div>
// The closing brace for the return statement must be here
  );
}; // The closing brace for the function must be here

// The commented out sections are restored to their original state (commented out)

// {/* Clerk Reports Tab */}
// {activeTab === 'reports' && (
//   <div>
  
//     <h2 className="text-xl font-semibold text-white mb-6">Detailed Reports on Clerks' Entries</h2>
//     <div className="overflow-x-auto">
//       <table className="w-full text-gray-300">
//         <thead className="bg-gray-800 text-gray-200">
//           <tr>
  
//             <th className="p-3 text-left">Clerk</th>
//             <th className="p-3 text-left">Date</th>
//             <th className="p-3 text-left">Action</th>
//             <th className="p-3 text-left">Product</th>
  
//             <th className="p-3 text-left">Quantity</th>
//             <th className="p-3 text-left">Notes</th>
//           </tr>
//         </thead>
        
//         <tbody>
//           {clerkReports.map(report => (
//             <tr key={report.id} className="border-t border-gray-700 hover:bg-gray-800/50">
//               <td className="p-3 font-medium">{report.clerkName}</td>
//               <td className="p-3">{report.date}</td>
//               <td className="p-3">
//                 <span className={`px-2 py-1 rounded-full text-xs ${
//                   report.action === 'Added Stock' ?
//                   'bg-green-700 text-green-200' :
//                   report.action === 'Recorded Spoilage' ?
//                   'bg-red-700 text-red-200' :
//                   report.action === 'Updated Prices' ?
//                   'bg-blue-700 text-blue-200' :
//                   'bg-yellow-700 text-yellow-200'
//                 }`}>{report.action}</span>
//               </td>
//               <td className="p-3">{report.product}</td>
//               <td className="p-3">{report.quantity ||
//               'N/A'}</td>
//               <td className="p-3 text-sm">{report.notes}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   </div>
// )}

// {/* Supplier Payments Tab */}
// {activeTab === 'payments' && (
//   <div>
  
//     <h2 className="text-xl font-semibold text-white mb-6">Supplier Payment Tracking</h2>
//     <div className="overflow-x-auto">
//       <table className="w-full text-gray-300">
//         <thead className="bg-gray-800 text-gray-200">
//           <tr>
          
//             <th className="p-3 text-left">Supplier</th>
//             <th className="p-3 text-left">Amount</th>
//             <th className="p-3 text-left">Due Date</th>
//             <th className="p-3 text-left">Products</th>
//             <th className="p-3 text-left">Status</th>
//             <th className="p-3 text-left">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
 
//           {payments.map(payment => (
//             <tr key={payment.id} className="border-t border-gray-700 hover:bg-gray-800/50">
//               <td className="p-3 font-medium">{payment.supplier}</td>
//               <td 
//               className="p-3 font-semibold">Ksh {payment.amount.toLocaleString()}</td>
//               <td className="p-3">{payment.dueDate}</td>
//               <td className="p-3 text-sm">{payment.products.join(', ')}</td>
//               <td className="p-3">
              
//                 <span className={`px-2 py-1 rounded-full text-xs ${
//                   payment.status === 'paid' ?
//                   'bg-green-700 text-green-200' :
//                   payment.status === 'unpaid' ?
//                   'bg-yellow-700 text-yellow-200' : 'bg-red-700 text-red-200'
//                 }`}>
//                   {payment.status}
//                   {payment.paidDate && ` (${payment.paidDate})`}
  
//                 </span>
//               </td>
//               <td className="p-3">
//                 {payment.status !== 'paid' 
//                 && (
//                   <div className="flex space-x-2">
//                     <button 
//                       onClick={() => updatePaymentStatus(payment.id, 
//                       'paid')} 
//                       className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
//                     >
                
//        Mark Paid
//                     </button>
//                     {payment.status === 'overdue' && (
                
//        <button 
//                         onClick={() => updatePaymentStatus(payment.id, 'unpaid')} 
//                         className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs transition-colors"
  
//                     >
//                         Mark Pending
//                       </button>
//                     )}
//                   </div>
//                 )}
              
//   </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>

//   </div>
// )}



export default AdminDashboard;