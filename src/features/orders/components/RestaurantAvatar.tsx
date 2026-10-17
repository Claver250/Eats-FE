"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const colors = [
  "bg-red-100 text-red-700",
  "bg-yellow-100 text-yellow-700",
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-orange-100 text-orange-700",
];

function colorFor(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 997;
  return colors[h % colors.length];
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

// Looks for /public/restaurants/<slug>.svg and falls back to colored initials.
export default function RestaurantAvatar({ name }: { name: string }) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/restaurants/${slug(name)}.svg`}
        alt={`${name} logo`}
        onError={() => setFailed(true)}
        className="h-10 w-10 shrink-0 rounded-full border border-border object-cover"
      />
    );
  }

  return (
    <span
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold",
        colorFor(name),
      )}
    >
      {initials(name)}
    </span>
  );
}
