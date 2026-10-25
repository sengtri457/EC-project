"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, DEMO_USERS } from "@/context/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/catalog";

  const { user, login, loginWithDemo, logout } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }

    if (isSignUp && (!name.trim() || name.trim().length < 2)) {
      setError("Please enter your full name.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, isSignUp ? name : undefined);
      router.push(redirectUrl);
    } catch {
      setError("Unable to authenticate. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSelect = (index: number) => {
    loginWithDemo(index);
    router.push(redirectUrl);
  };

  if (user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="border border-border bg-paper p-8 shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper font-mono text-sm font-semibold mb-4">
            {user.name.charAt(0)}
          </div>
          <span className="type-label text-[10px] uppercase tracking-widest text-ink-soft">
            Active Account
          </span>
          <h2 className="type-display mt-2 text-2xl font-bold text-ink">{user.name}</h2>
          <p className="mt-1 font-mono text-xs text-ink-soft">{user.email}</p>
          {user.phone && <p className="font-mono text-xs text-ink-soft">Tel: {user.phone}</p>}

          {user.address && (
            <div className="mt-4 border-t border-border pt-4 text-xs font-mono text-ink-soft text-left bg-canvas/40 p-3">
              <span className="block text-[10px] uppercase tracking-wider text-ink font-semibold mb-1">
                Saved Delivery Location:
              </span>
              <p>{user.address.streetAddress || user.address.street}</p>
              <p>
                {user.address.sangkatCommune ? `Sangkat ${user.address.sangkatCommune}, ` : ""}
                {user.address.khanDistrict ? `Khan ${user.address.khanDistrict}, ` : ""}
                {user.address.cityProvince || user.address.city}
              </p>
              {user.address.landmark && (
                <p className="italic text-ink-soft/80 mt-0.5">Landmark: {user.address.landmark}</p>
              )}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href={redirectUrl}
              className="type-label inline-flex items-center justify-center bg-ink py-3 text-xs uppercase tracking-widest text-paper hover:bg-ink-soft transition-colors"
            >
              Continue to {redirectUrl.includes("checkout") ? "Checkout" : "Catalog"}
            </Link>
            <button
              onClick={logout}
              className="type-label inline-flex items-center justify-center border border-border py-2.5 text-xs uppercase tracking-widest text-ink hover:text-ctrl-red hover:border-ctrl-red transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <div className="text-center mb-8">
        <span className="type-label text-xs uppercase tracking-widest text-ink-soft">
          Member Access
        </span>
        <h1 className="type-display mt-2 text-3xl font-normal text-ink sm:text-4xl">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h1>
        <p className="mt-2 text-xs font-mono text-ink-soft">
          Sign in for faster checkout, order tracking, and receipt access.
        </p>
      </div>

      <div className="border border-border bg-paper p-6 sm:p-8 shadow-sm">
        {/* Tab switch */}
        <div className="grid grid-cols-2 border-b border-border pb-4 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setError(null);
            }}
            className={`text-xs font-mono uppercase tracking-wider pb-2 border-b-2 transition-colors cursor-pointer ${
              !isSignUp ? "border-ink text-ink font-semibold" : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setError(null);
            }}
            className={`text-xs font-mono uppercase tracking-wider pb-2 border-b-2 transition-colors cursor-pointer ${
              isSignUp ? "border-ink text-ink font-semibold" : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mb-5 border border-ctrl-red/30 bg-ctrl-red/5 p-3 text-xs text-ctrl-red font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="type-label block text-xs uppercase tracking-wider text-ink mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sophea Chan"
                className="w-full border border-border bg-canvas px-3.5 py-2.5 text-xs text-ink placeholder:text-ink-soft/50 focus:border-ink focus:outline-none font-mono"
              />
            </div>
          )}

          <div>
            <label className="type-label block text-xs uppercase tracking-wider text-ink mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. sophea.chan@gmail.com"
              className="w-full border border-border bg-canvas px-3.5 py-2.5 text-xs text-ink placeholder:text-ink-soft/50 focus:border-ink focus:outline-none font-mono"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="type-label text-xs uppercase tracking-wider text-ink">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] font-mono text-ink-soft hover:text-ink underline cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-border bg-canvas px-3.5 py-2.5 text-xs text-ink placeholder:text-ink-soft/50 focus:border-ink focus:outline-none font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="type-label mt-2 w-full bg-ink py-3 text-xs uppercase tracking-widest text-paper hover:bg-ink-soft transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Validating..." : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        {/* Demo Login Quick-Bar */}
        <div className="mt-8 border-t border-border pt-6">
          <span className="type-label block text-[10px] uppercase tracking-wider text-ink-soft text-center mb-3">
            1-Click Cambodia Test Profiles
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DEMO_USERS.map((demo, idx) => (
              <button
                key={demo.id}
                type="button"
                onClick={() => handleDemoSelect(idx)}
                className="flex flex-col items-start border border-border/80 bg-canvas/60 p-2.5 text-left hover:border-ink hover:bg-paper transition-all cursor-pointer group"
              >
                <span className="text-[11px] font-semibold text-ink group-hover:underline">
                  {demo.name}
                </span>
                <span className="text-[10px] font-mono text-ink-soft">
                  {demo.address?.cityProvince} &bull; {demo.address?.khanDistrict || "Province"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Guest checkout fallback */}
        <div className="mt-6 text-center">
          <Link
            href={redirectUrl}
            className="text-xs font-mono text-ink-soft hover:text-ink underline underline-offset-4"
          >
            Continue as Guest without signing in →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[50vh] max-w-md items-center justify-center">
          <p className="font-mono text-xs uppercase tracking-wider text-ink-soft">
            Loading...
          </p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
