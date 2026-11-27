"use client";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Lock, User, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        window.location.href = "/4dm1n-n3ur0v4nt4";
        return;
      }
      toast.error(data.message);
    } catch {
      toast.error("An error occurred during login");
    }
    setIsSubmitting(false);
  };

  const inputClass =
    "w-full rounded-xl border border-border-color/70 bg-cream-bg/60 py-3 pl-11 pr-4 text-sm text-secondary placeholder:text-gray-400 transition-all focus:border-[#BFA373] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#BFA373]/15";

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] bg-white">
      {/* Visual panel */}
      <div className="relative hidden lg:block overflow-hidden bg-black">
        <Image
          src="/assets/images/footer/footer-bg.jpg"
          alt=""
          fill
          priority
          sizes="55vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 to-transparent" />

        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/80 ring-1 ring-white/20 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#BFA373]" />
            Backend Console
          </span>

          <div className="flex flex-col gap-6">
            <Image
              src="/assets/logos/footer-logo.svg"
              alt=""
              width={1717}
              height={218}
              className="w-full max-w-[520px] h-auto"
            />
            <div>
              <h1 className="text-[34px] leading-[1.15] font-medium max-w-[18ch]">
                Wellness &amp; Longevity, Managed
              </h1>
              <p className="mt-3 max-w-[44ch] text-sm leading-relaxed text-white/65">
                Manage pages, solutions, systems, industries and navigation for
                the Neuro Vanta website from one place.
              </p>
            </div>
            <div className="h-px w-16 bg-[#BFA373]" />
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex items-center justify-center px-6 py-12 bg-[#F4F1EC] bg-[radial-gradient(ellipse_at_top_right,rgba(191,163,115,0.14),transparent_55%)]">
        <div className="w-full max-w-[420px]">
          <div className="rounded-2xl bg-white p-8 sm:p-10 border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_48px_-24px_rgba(81,70,62,0.25)]">
            <div className="flex flex-col items-center gap-5 text-center">
              <Image
                src="/assets/logos/header-logo-full.svg"
                alt="Neuro Vanta"
                width={180}
                height={60}
                className="h-auto w-[170px]"
              />
              <div>
                <h2 className="text-[22px] font-semibold text-secondary">
                  Welcome back
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Sign in to continue to the admin console.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[13px] font-medium text-gray-600">
                  Username
                </span>
                <span className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    autoFocus
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={inputClass}
                  />
                </span>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[13px] font-medium text-gray-600">
                  Password
                </span>
                <span className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition-colors hover:text-secondary cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group mt-3 flex items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-sm font-medium text-white shadow-[0_8px_20px_-8px_rgba(81,70,62,0.6)] transition-all hover:bg-[#3f362f] hover:shadow-[0_10px_24px_-8px_rgba(81,70,62,0.7)] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-[12px] text-gray-400">
            © {new Date().getFullYear()} Neuro Vanta · Authorised access only
          </p>
        </div>
      </div>
    </div>
  );
}
