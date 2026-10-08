export const formatNumber = (n: number) =>
    new Intl.NumberFormat("en-US").format(n);

export const formatCurrency = (n: number, digits = 0) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(n);