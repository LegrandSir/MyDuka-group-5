const Card = ({ title, value, icon: Icon }) => (
  <div className="bg-[#041524] backdrop-blur-md border border-gray-900 rounded-2xl p-4 flex justify-between items-center shadow-2xl">
    <div>
      <p className="text-sm text-gray-300">{title}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
    <Icon className="w-6 h-6 text-gray-400" />
  </div>
);

export default Card;