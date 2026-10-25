"use client";

import React, { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="mt-6 border border-forest/30 bg-forest/5 p-4 text-xs font-mono text-forest">
        ✓ Thank you for subscribing. Use code <strong className="font-bold underline">WELCOME10</strong> for 10% off your order.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address..."
        className="w-full sm:w-auto flex-1 border border-border bg-canvas px-4 py-2.5 text-xs text-ink placeholder:text-ink-soft/40 focus:border-ink focus:outline-none font-mono"
      />
      <button
        type="submit"
        className="type-label w-full sm:w-auto bg-ink px-6 py-2.5 text-xs uppercase tracking-widest text-paper hover:bg-ink-soft transition-colors font-semibold cursor-pointer shrink-0"
      >
        Subscribe
      </button>
    </form>
  );
}
