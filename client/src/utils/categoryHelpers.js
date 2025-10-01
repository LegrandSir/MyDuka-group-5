// export function countProductsInCategory(categoryId, products) {
//   if (!Array.isArray(products)) return 0;
//   return products.filter((p) => p.category_id === categoryId).length;
// }


// export function getCategoryName(categoryId, categories) {
//   if (!Array.isArray(categories)) return "N/A";
//   const cat = categories.find((c) => c.id === categoryId);
//   return cat ? cat.name : "N/A";
// }


// export function sortCategories(categories) {
//   if (!Array.isArray(categories)) return [];
//   return [...categories].sort((a, b) => a.name.localeCompare(b.name));
// }