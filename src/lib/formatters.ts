export const formatNumber = (n: number) =>
    new Intl.NumberFormat("en-US").format(n);

export const formatCurrency = (n: number, digits = 0, currency = "USD") =>
    new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(n);

// Short money for dashboard cards: 4,820,000 -> "₦4.82m", 18,600,000 -> "₦18.6m".
export function formatCompactNaira(n: number) {
    const units = [
        { value: 1e9, suffix: "b" },
        { value: 1e6, suffix: "m" },
        { value: 1e3, suffix: "k" },
    ];
    for (const u of units) {
        if (Math.abs(n) >= u.value) {
        const x = n / u.value;
        const digits = Math.abs(x) < 10 ? 2 : 1;
        return `₦${parseFloat(x.toFixed(digits))}${u.suffix}`;
        }
    }
    return `₦${n}`;
    }