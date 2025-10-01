export default function StatusBadge({ status }) {
  const colors = {
    pending: "bg-yellow-900/50 text-yellow-300",
    approved: "bg-green-900/50 text-green-300",
    rejected: "bg-red-900/50 text-red-300",
    stockLow: "bg-red-900/50 text-red-300",
    stockOk: "bg-green-900/50 text-green-300",
  };
  return (
    <span className={`px-2 py-1 rounded text-xs ${colors[status] || "bg-gray-700 text-gray-300"}`}>
      {status}
    </span>
  );
}
