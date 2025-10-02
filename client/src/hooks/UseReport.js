import React, { useEffect, useState } from "react";
import api from "../services/api"; // adjust path if needed

function ReportsDashboard({ storeId }) {
  const [period, setPeriod] = useState("weekly");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (storeId) {
      fetchReport();
    }
  }, [period, storeId]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.getStoreReport(storeId, period);
      setReport(data);
    } catch (err) {
      console.error("Error fetching report:", err);
      setError(err.message || "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📊 Store Report</h1>

      {/* Select period */}
      <div className="mb-4">
        <label className="font-semibold mr-2">Period:</label>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {loading && <p>Loading report...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Report summary */}
      {report && (
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Summary ({period})</h2>
          <p><strong>Total Requests:</strong> {report.total_requests}</p>
          <p><strong>Approved:</strong> {report.approved}</p>
          <p><strong>Rejected:</strong> {report.rejected}</p>
          <p><strong>Pending:</strong> {report.pending}</p>
        </div>
      )}
    </div>
  );
}

export default ReportsDashboard;
