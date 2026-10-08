type Props = {
    percent: number;
    color: string; // any CSS color, e.g. "var(--color-success)"
    size?: number;
    stroke?: number;
};

export default function DonutProgress({
    percent,
    color,
    size = 72,
    stroke = 7,
}: Props) {
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - Math.min(Math.max(percent, 0), 100) / 100);

    return (
        <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
            <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={stroke}
            />
            <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
            {percent}%
        </span>
        </div>
    );
}