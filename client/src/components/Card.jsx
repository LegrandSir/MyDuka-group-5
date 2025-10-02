export default function Card({ title, value, icon: Icon, color = "blue", ...rest }) {
  
  const gradient = {
    blue: "from-blue-900/20 to-blue-700/10",
    green: "from-green-900/20 to-green-700/10",
    purple: "from-purple-900/20 to-purple-700/10",
    yellow: "from-yellow-900/20 to-yellow-700/10",
  }[color] || "from-gray-900/20 to-gray-700/10";

  return (
    <div {...rest} className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} border border-gray-800`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-300">{title}</div>
          <div className="text-2xl font-bold text-white">{value}</div>
        </div>
        {Icon && <Icon className="w-8 h-8 text-white/80" />}
      </div>
    </div>
  );
}