import React from "react";
import { Link } from "react-router-dom";

// Eat Stack logo: three stacked plates + wordmark.
export default function Logo({ className = "", light = false }) {
  const text = light ? "text-white" : "text-ink";
  return (
    <Link to="/" aria-label="Eat Stack home" className={`flex items-center gap-2 ${className}`}>
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="4" y="21" width="24" height="5" rx="2.5" className="fill-paprika-600" />
        <rect x="7" y="14" width="18" height="5" rx="2.5" className="fill-paprika-500" />
        <rect x="10" y="7" width="12" height="5" rx="2.5" className="fill-basil-500" />
      </svg>
      <span className={`font-display text-2xl leading-none ${text}`}>
        Eat<span className="text-paprika-600">Stack</span>
      </span>
    </Link>
  );
}
