import React, { useState } from 'react';
import {  Users, ShoppingCart, Package, Plus, Check, X, Store, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const users = [
  { id: 1, name: 'John Merchant', role: 'merchant' },
  { id: 2, name: 'Jane Admin', role: 'admin', storeId: 1 },
  { id: 3, name: 'Bob Clerk', role: 'clerk', storeId: 1 }
];
const products = [
  {
    id: 1,
    name: 'Product A',
    storeId: 1,
    price: 20, 
    status: 'paid',
    stock:85,
    buyingPrice: 3000,
    sellingPrice: 3900,
    image:
      'https://images.unsplash.com/photo-1601784551446-20c9e07cd590?q=80&w=1983&auto=format&fit=crop',
  },
  { 
    id: 2,
    name: 'Product B', 
    storeId: 1, 
    stock: 150, 
    price: 12, 
     buyingPrice: 2000,
    sellingPrice: 2900,
    status: 'unpaid',
    image:
      'https://images.unsplash.com/photo-1601784551446-20c9e07cd590?q=80&w=1983&auto=format&fit=crop', 
  },
];
const requests = [
  { id: 1, product: 'Product A', qty: 50, status: 'pending', storeId: 1 },
  { id: 2, product: 'Product B', qty: 100, status: 'approved', storeId: 1 }
];
const chartData = [
  { name: 'Store 1', sales: 4000, profit: 2400 },
  { name: 'Store 2', sales: 3000, profit: 1398 }
];

const Card = ({ title, value, icon: Icon }) => (
  <div className="bg-[#041524] backdrop-blur-md border border-gray-900 rounded-2xl p-4 flex justify-between items-center shadow-2xl">
    <div>
      <p className="text-sm text-gray-300">{title}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
    <Icon className="w-6 h-6 text-gray-400" />
  </div>
);

const Clerk = ({ user }) => {
  const [items, setItems] = useState(products.filter(p => p.storeId === user.storeId));
  const [showForm, setShowForm] = useState(false);
  const [supplyRequests, setSupplyRequests] = useState([]);

  
  const addItem = e => {
    e.preventDefault();
    const f = e.target;

    const newItem = {
      id: Date.now(),
      name: f.name.value,
      itemsReceived: +f.itemsReceived.value,
      stock: +f.stock.value,
      spoilt: +f.spoilt.value,
      buyingPrice: +f.buyingPrice.value,
      sellingPrice: +f.sellingPrice.value,
      status: f.status.value,
      storeId: user.storeId,
    };

    setItems([...items, newItem]);
    f.reset();
    setShowForm(false);
  };

  const submitRequest = (e) => {
    e.preventDefault();
    const f = e.target;
    const newRequest = {
      id: Date.now(),
      product: f.product.value,
      qty: +f.qty.value,
      note: f.note.value,
      status: "pending",
      storeId: user.storeId
    };
    setSupplyRequests([...supplyRequests, newRequest]);
    f.reset();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card title="Products" value={items.length} icon={Package} />
        <Card title="Stock" value={items.reduce((s, p) => s + p.stock, 0)} icon={ShoppingCart} />
        <Card title="Revenue" value="NaN" icon={DollarSign} />
        {/* <Card title="Revenue" value={`Ksh ${items.reduce((s, p) => s + p.stock * p.price, 0)}`} icon={DollarSign} /> */}
      </div>

      {/* Inventory */}
      <div className="bg-[#041524] backdrop-blur-md border border-gray-900 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Inventory</h2>
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 px-3 py-2 rounded text-white flex items-center">
            <Plus className="w-4 h-4 mr-1" /> Add
          </button>
        </div>

        {showForm && (
          <form onSubmit={addItem} className="mb-4 grid grid-cols-3 gap-3">
            <input name="name" placeholder="Name" className="bg-gray-700 rounded px-3 py-2 text-white" />
            <select name="status" className="bg-[#0a223a] border border-gray-700 rounded px-3 py-2 text-white">
              <option value="paid">Paid</option>
              <option value="unpaid">Not Paid</option>
            </select>
            <input name="itemsReceived" type="number" placeholder="Items Received" className="bg-[#0a223a] border border-gray-700 rounded px-3 py-2 text-white" />
            <input name="stock" type="number" placeholder="Stock in Hand" className="bg-[#0a223a] border border-gray-700 rounded px-3 py-2 text-white" />
            <input name="spoilt" type="number" placeholder="Spoilt Items" className="bg-[#0a223a] border border-gray-700 rounded px-3 py-2 text-white" />
            <input name="buyingPrice" type="number" placeholder="Buying Price" className="bg-[#0a223a] border border-gray-700 rounded px-3 py-2 text-white" />
            <input name="sellingPrice" type="number" placeholder="Selling Price" className="bg-[#0a223a] border border-gray-700 rounded px-3 py-2 text-white" />
            <button type="submit" className="col-span-3 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">Save</button>
          </form>
        )}

        <table className="w-full text-gray-300">
          <thead className="bg-[#0a223a] text-gray-200">
           <table className="w-full text-gray-300 mt-4">
          <thead className="bg-[#0a223a] text-gray-200">
            <tr>
              <th className="p-2">Product</th>
              <th className="p-2">Received</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Spoilt</th>
              <th className="p-2">Buying</th>
              <th className="p-2">Selling</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map(p => (
              <tr key={p.id} className="border-t border-gray-700">
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.itemsReceived || "-"}</td>
                <td className="p-2">{p.stock}</td>
                <td className="p-2">{p.spoilt || 0}</td>
                <td className="p-2">Ksh {p.buyingPrice || "-"}</td>
                <td className="p-2">Ksh {p.sellingPrice || "-"}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs ${p.status === 'paid' ? 'bg-green-700 text-green-200' : 'bg-red-700 text-red-200'}`}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
          </thead>
        </table>
      </div>

      {/* Supply Request Form */}
      <div className="bg-[#041524] backdrop-blur-md border border-gray-900 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-white mb-4">Submit Supply Request</h2>
        <form onSubmit={submitRequest} className="grid grid-cols-2 gap-3">
          <input name="product" placeholder="Product" className="bg-[#0a223a] border border-gray-700 rounded px-3 py-2 text-white" />
          <input name="qty" type="number" placeholder="Quantity" className="bg-[#0a223a] border border-gray-700 rounded px-3 py-2 text-white" />
          <textarea name="note" placeholder="Additional notes..." rows="2" className="col-span-2 bg-[#0a223a] border border-gray-700 rounded px-3 py-2 text-white"></textarea>
          <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Send Request</button>
        </form>

        {supplyRequests.length > 0 && (
          <div className="mt-4">
            <h3 className="text-md font-semibold text-gray-200 mb-2">My Requests</h3>
            <ul className="space-y-2">
              {supplyRequests.map(r => (
                <li key={r.id} className="bg-[#0a223a] px-3 py-2 rounded flex justify-between">
                  <span>{r.product} — {r.qty} ({r.status})</span>
                  <span className="text-gray-400 text-sm">{r.note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const Admin = ({ user }) => {
  const [reqs, setReqs] = useState(requests.filter(r => r.storeId === user.storeId));
  const [clerks, setClerks] = useState(users.filter(u => u.role === "clerk" && u.storeId === user.storeId));

  const act = (id, s) => setReqs(reqs.map(r => r.id === id ? { ...r, status: s } : r));

  const togglePayment = (id) => {
    setReqs(reqs.map(r => r.id === id ? { ...r, status: r.status === "paid" ? "unpaid" : "paid" } : r));
  };

  // Clerk management
  const addClerk = (e) => {
    e.preventDefault();
    const f = e.target;
    const newClerk = {
      id: Date.now(),
      name: f.name.value,
      role: "clerk",
      storeId: user.storeId
    };
    setClerks([...clerks, newClerk]);
    f.reset();
  };

  const toggleClerkStatus = (id) => {
    setClerks(clerks.map(c => c.id === id ? { ...c, active : !c.active } : c));
  };

  const deleteClerk = (id) => {
    setClerks(clerks.filter(c => c.id !== id));
  };


  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card title="Products" value={products.length} icon={Package} />
        <Card title="Pending Requests" value={reqs.filter(r => r.status === "pending").length} icon={ShoppingCart} />
        <Card title="Paid Suppliers" value={reqs.filter(r => r.status === "paid").length} icon={DollarSign} />
        <Card title="Unpaid Suppliers" value={reqs.filter(r => r.status === "unpaid").length} icon={DollarSign} />
        <Card title="Revenue" value="Ksh 8,450" icon={DollarSign} />
      </div>

      {/* Supply Requests */}
      <div className="bg-[#041524] backdrop-blur-md border border-gray-900 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-white mb-4">Supply Requests</h2>
        <table className="w-full text-gray-300">
          <thead className="bg-[#0a223a] text-gray-200">
            <tr>
              <th className="p-2">Product</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reqs.map(r => (
              <tr key={r.id} className="border-t border-gray-700">
                <td className="p-2">{r.product}</td>
                <td className="p-2">{r.qty}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    r.status === "approved" ? "bg-green-700 text-green-200" :
                    r.status === "pending" ? "bg-yellow-700 text-yellow-200" :
                    r.status === "declined" ? "bg-red-700 text-red-200" :
                    r.status === "paid" ? "bg-blue-700 text-blue-200" :
                    "bg-gray-700 text-gray-200"
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="p-2 space-x-2">
                  {r.status === "pending" && (
                    <>
                      <button onClick={() => act(r.id, "approved")} className="text-green-400"><Check className="w-4 h-4" /></button>
                      <button onClick={() => act(r.id, "declined")} className="text-red-400"><X className="w-4 h-4" /></button>
                    </>
                  )}
                  {r.status === "approved" && (
                    <button onClick={() => togglePayment(r.id)} className="text-blue-400">Mark {r.status === "paid" ? "Unpaid" : "Paid"}</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Clerk Management */}
      <div className="bg-[#041524] backdrop-blur-md border border-gray-900 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-white mb-4">Manage Clerks</h2>
        <form onSubmit={addClerk} className="mb-4 flex space-x-3">
          <input name="name" placeholder="Clerk Name" className="bg-[#0a223a] border border-gray-700 rounded px-3 py-2 text-white flex-1" />
          <button type="submit" className="bg-green-600 text-white px-4 rounded">Add</button>
        </form>
        <table className="w-full text-gray-300">
          <thead className="bg-[#0a223a] text-gray-200">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clerks.map(c => (
              <tr key={c.id} className="border-t border-gray-700">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.active ? "Inactive" : "Active"}</td>
                <td className="p-2 space-x-2">
                  <button onClick={() => toggleClerkStatus(c.id)} className="text-yellow-400">{c.active ? 'Activate' : 'Deactivate'}</button>
                  <button onClick={() => deleteClerk(c.id)} className="text-red-400">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reports */}
      <div className="bg-[#041524] backdrop-blur-md border border-gray-900 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-white mb-4">Clerk Reports</h2>
        <p className="text-gray-300">Here you could fetch and display detailed reports on clerks’ entries (items received, stock, spoilt, etc.).</p>
      </div>
    </div>
  );
}

const Merchant = () => {
  const [admins, setAdmins] = useState(users.filter(u => u.role === "admin"));
  const [selectedStore, setSelectedStore] = useState(null);

  // Admin management
  const addAdmin = (e) => {
    e.preventDefault();
    const f = e.target;
    const newAdmin = {
      id: Date.now(),
      name: f.name.value,
      role: "admin",
      storeId: admins.length + 1 // just mock logic
    };
    setAdmins([...admins, newAdmin]);
    f.reset();
  };

  const deactivateAdmin = (id) =>
    setAdmins(admins.map(a => a.id === id ? { ...a, active: false } : a));

  const deleteAdmin = (id) =>
    setAdmins(admins.filter(a => a.id !== id));

  // Paid vs unpaid tracker
  const totalPaid = products.filter(p => p.status === "paid").length;
  const totalUnpaid = products.filter(p => p.status === "unpaid").length;

  // Drill down data
  const storeProducts = selectedStore
    ? products.filter(p => p.storeId === selectedStore.id)
    : [];

  return (
  <div className="space-y-6">
    {/* Stats */}
    <div className="grid grid-cols-4 gap-4">
      <Card title="Stores" value="2" icon={Store} />
      <Card title="Products" value={products.length} icon={Package} />
      <Card title="Staff" value={admins.length} icon={Users} />
      <Card title="Revenue" value="Ksh 24500" icon={DollarSign} />
    </div>
    <div className="bg-[#041524] backdrop-blur-md border border-gray-900 rounded-2xl p-6 shadow-2xl">
      <h2 className="text-lg font-semibold text-white mb-4">Performance</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Bar dataKey="sales" fill="#3B82F6" />
          <Bar dataKey="profit" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex space-x-4 mt-4">
          {chartData.map(store => (
            <button
              key={store.name}
              onClick={() => setSelectedStore(store)}
              className="px-3 py-1 bg-blue-700 text-white rounded"
            >
              {store.name}
            </button>
          ))}
        </div>
      </div>

      {/* Drill-down into store products */}
      {selectedStore && (
        <div className="bg-[#041524] border border-gray-900 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-4">
            {selectedStore.name} - Product Performance
          </h2>
          <table className="w-full text-gray-300">
            <thead className="bg-[#0a223a] text-gray-200">
              <tr>
                <th className="p-2">Product</th>
                <th className="p-2">Stock</th>
                <th className="p-2">Price</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {storeProducts.map(p => (
                <tr key={p.id} className="border-t border-gray-700">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.stock}</td>
                  <td className="p-2">Ksh {p.price}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${p.status === 'paid' ? 'bg-green-700 text-green-200' : 'bg-red-700 text-red-200'}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paid vs unpaid */}
      <div className="bg-[#041524] border border-gray-900 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-white mb-4">Payment Tracking</h2>
        <p className="text-gray-300">Paid products: {totalPaid}</p>
        <p className="text-gray-300">Unpaid products: {totalUnpaid}</p>
      </div>

      {/* Manage Admins */}
      <div className="bg-[#041524] border border-gray-900 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-white mb-4">Manage Admins</h2>
        <form onSubmit={addAdmin} className="mb-4 flex space-x-3">
          <input
            name="name"
            placeholder="Admin Name"
            className="bg-[#0a223a] border border-gray-700 rounded px-3 py-2 text-white flex-1"
          />
          <button type="submit" className="bg-green-600 text-white px-4 rounded">Add</button>
        </form>
        <table className="w-full text-gray-300">
          <thead className="bg-[#0a223a] text-gray-200">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(a => (
              <tr key={a.id} className="border-t border-gray-700">
                <td className="p-2">{a.name}</td>
                <td className="p-2">{a.active === false ? "Inactive" : "Active"}</td>
                <td className="p-2 space-x-2">
                  <button onClick={() => deactivateAdmin(a.id)} className="text-yellow-400">Deactivate</button>
                  <button onClick={() => deleteAdmin(a.id)} className="text-red-400">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};



const App = () => {
   const [user, setUser] = useState(users[2]);
  const Dash = user.role === 'clerk' ? Clerk : user.role === 'admin' ? Admin : Merchant;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <div className="bg-[#041524] backdrop-blur-md border-b border-gray-900 px-6 py-4 flex justify-between rounded-b-2xl shadow-2xl">
        <h1 className="text-xl font-bold text-white">MY DUKA Inventory</h1>
        <div className="flex items-center space-x-4">
          <select value={user.id} onChange={e => setUser(users.find(u => u.id === +e.target.value))}
            className="bg-[#0a223a] border border-gray-700 rounded px-3 py-2 text-white">
            {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
          </select>
          <span className={`px-3 py-1 text-sm rounded ${user.role === 'clerk' ? 'bg-blue-700 text-blue-200' : user.role === 'admin' ? 'bg-green-700 text-green-200' : 'bg-purple-700 text-purple-200'}`}>
            {user.role.toUpperCase()}
          </span>
        </div>
      </div>
      <div className="p-6"><Dash user={user} /></div>
    </div>
  );
};

export default App;