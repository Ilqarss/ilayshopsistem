export function formatCurrency(value: number) {
  return new Intl.NumberFormat("az-AZ", {
    style: "currency",
    currency: "AZN",
    maximumFractionDigits: 2
  }).format(value);
}