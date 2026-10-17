export const formatNumber = (n: number) =>
    new Intl.NumberFormat("en-US").format(n);

export const formatCurrency = (n: number, digits = 0, currency = "USD") =>
    new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(n);