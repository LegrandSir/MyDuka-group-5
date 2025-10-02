import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = {
  paid: "#10B981",   // green
  unpaid: "#EF4444", // red
};

export default function MerchantOverviewSection({ stores, payments }) {
  const overviewData = stores.map((s) => {
    const storePayments = payments.filter((p) => p.store_id === s.id);
    const total = storePayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const paid = storePayments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + Number(p.amount), 0);
    const unpaid = total - paid;
    return { name: s.name, paid, unpaid };
  });

  return (
    <div>
      <h2 className="text-xl text-white mb-4">Store Reports</h2>

      {overviewData.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={overviewData}>
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Bar dataKey="paid" fill={COLORS.paid} stackId="a" />
            <Bar dataKey="unpaid" fill={COLORS.unpaid} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-400 italic">
          No stores or payments available for reporting.
        </p>
      )}
    </div>
  );
}