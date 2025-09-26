import { TrendingUp, TrendingDown} from 'lucide-react'
const Card = ({ title, value, icon: Icon, color = 'blue', onClick = null, trend = null }) => (
  <div 
    className={`bg-gradient-to-br from-${color}-900/20 to-${color}-800/10 backdrop-blur-sm border border-${color}-800/30 rounded-xl p-4 shadow-lg ${onClick ? 'cursor-pointer hover:bg-gray-800/30' : ''}`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {trend && (
          <div className={`flex items-center gap-1 mt-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span className="text-xs">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <Icon className={`w-8 h-8 text-${color}-400`} />
    </div>
  </div>
);


export default Card;