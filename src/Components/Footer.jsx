import React from "react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="grain bg-cream border-t border-line mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-stone-warm max-w-md">
            A full-stack food ordering project: React and Tailwind on the front, Node/Express and MongoDB for
            accounts and reviews, and a FastAPI service for AI nutrition estimates.
          </p>
        </div>
        <p className="text-xs text-stone-warm">
          Portfolio project. Restaurant data and photos are used for demonstration only.
        </p>
      </div>
    </footer>
  );
}
