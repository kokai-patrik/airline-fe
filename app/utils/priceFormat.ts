export function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(price);
}
