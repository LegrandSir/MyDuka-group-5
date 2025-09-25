const TabButton = ({ id, label, isActive, onClick, icon: Icon }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

export default TabButton;