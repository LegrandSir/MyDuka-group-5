// src/utils/stockHelpers.js
export function getStockClass(qty) {
  if (qty <= 0) return "bg-red-600 text-white";
  if (qty < 10) return "bg-yellow-600 text-white";
  return "bg-green-600 text-white";
}