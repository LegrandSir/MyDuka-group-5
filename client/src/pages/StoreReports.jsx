import { useState, useEffect } from "react";
import api from "../services/api";

const StoreReports = ({ storeId }) => {
  const [period, setPeriod] = useState("weekly");
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await api.getStoreReport(storeId, period);
        setReport(data);
      } catch (e) {
        console.error("Error fetching report", e);
      }
    };
    fetchReport();
  }, [storeId, period]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Store Reports</h2>
      <div className="mb-2">
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {report ? (
        <div className="bg-gray-100 p-3 rounded">
          <p>Supply Requests: {report.supply_requests}</p>
          <p>Approved: {report.approved_requests}</p>
          <p>Pending: {report.pending_requests}</p>
          <p>Rejected: {report.rejected_requests}</p>
          <p>Total Payments: {report.total_payments}</p>
          <p>Completed Payments: {report.completed_payments}</p>
          <h3 className="font-semibold mt-2">Inventory</h3>
          <ul>
            {report.inventory.map((inv) => (
              <li key={inv.product_id}>
                Product {inv.product_id}: {inv.quantity}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading report...</p>
      )}
    </div>
  );
};

export default StoreReports;
