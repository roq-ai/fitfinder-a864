const mapping: Record<string, string> = {
  companies: 'company',
  'market-researches': 'market_research',
  'product-ideas': 'product_idea',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
