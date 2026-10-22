/** Formats a BigDecimal amount (serialised as a JSON number). */
export const formatMoney = (amount: number, currency = 'USD') =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)
