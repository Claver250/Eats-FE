// Small decorative illustration for the page header. Purely visual, hidden from screen readers.
export default function StorefrontArt() {
    return (
        <svg
        viewBox="0 0 220 110"
        aria-hidden="true"
        className="h-24 w-auto"
        fill="none"
        >
        <path d="M22 72c-7-19 2-35 17-41 6 17 0 35-17 41z" fill="#CFEBD9" />
        <path d="M42 80c9-15 23-21 36-17-4 15-19 23-36 17z" fill="#B9E0C8" />
        <path
            d="M68 60c-9 0-15 7-15 15 0 11 15 25 15 25s15-14 15-25c0-8-6-15-15-15z"
            fill="#168A54"
        />
        <circle cx="68" cy="75" r="5" fill="#fff" />
        <rect x="104" y="48" width="72" height="52" rx="3" fill="#E8F5EE" stroke="#168A54" strokeWidth="3" />
        <rect x="116" y="66" width="22" height="34" fill="#168A54" />
        <rect x="148" y="66" width="19" height="18" rx="2" fill="#fff" stroke="#168A54" strokeWidth="3" />
        <path d="M99 28h82l6 21H93z" fill="#fff" stroke="#168A54" strokeWidth="3" strokeLinejoin="round" />
        <path d="M113 28l-3 21h10l1-21zM139 28v21h10l-1-21zM165 28l1 21h10l-4-21z" fill="#168A54" />
        </svg>
    );
}