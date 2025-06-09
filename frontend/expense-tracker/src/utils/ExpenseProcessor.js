
const categoryMap = {
  FOOD: 'Food/Beverage',
  TRAVEL: 'Travel/Commute',
  UTILITIES: 'Utilities',
  HEALTH: 'Health'
};

function formatDate(dateString) {
  // e.g. "2025-06-09" → "09 June 2025"
  const opts = { day: '2-digit', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', opts);
}
