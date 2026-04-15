"use client";

import React, { useState, useRef, useEffect } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import ErrorMessage from "./ErrorMessage";
import Image from "next/image";

interface FloatingSelectProps {
  label: string;
  id: string;
  options: { value: string; label: string }[];
  registration: UseFormRegisterReturn;
  error?: string;
  value?: string;
}

export const FloatingSelect: React.FC<FloatingSelectProps> = ({
  label,
  id,
  options,
  registration,
  error,
  value,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasValue = value && value.trim().length > 0;
  const isFloated = hasValue || open; // ✅ FIX

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        registration.onBlur?.(e as any);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [registration]);

  return (
    <div ref={containerRef} className="relative w-full group">
      {/* Label + Icon */}
      <div
        className={`
          absolute left-0 flex w-full justify-between items-center
          transition-all duration-300 ease-in-out
         ${
  isFloated
    ? "-top-[15px] text-15"
    : "text-19"
}
        `}
      >
        <label
          htmlFor={id}
          className="pointer-events-none text-secondary leading-[1.42] select-none"
        >
          {label}
        </label>

        <Image
          src="/assets/icons/down-arrow-tip.svg"
          alt="Chevron Down"
          width={13}
          height={13}
          className={`h-[10px] 3xl:h-[12px] w-auto transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {/* Select — unchanged */}
      <select
        id={id}
        {...registration}
        className={`
          w-full bg-transparent border-0 border-b outline-none appearance-none
          text-secondary text-19 cursor-pointer
          pt-[30px]
          transition-colors duration-300
          ${error ? "border-b-red-500" : "border-b-secondary"}
        `}
      >
        <option value="" disabled hidden />
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Selected value */}
      <span
        className={`
          absolute left-0 pointer-events-none
          text-19 text-secondary
          top-[30px]
          ${hasValue ? "opacity-100" : "opacity-0"}
        `}
      >
        {options.find((o) => o.value === value)?.label || "\u00A0"}
      </span>

      {/* Overlay */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={() => setOpen((p) => !p)}
      />

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute left-0 right-0 z-50 overflow-hidden rounded-b-sm"
            style={{
              background: "var(--cream-bg)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
          >
            {options.map((opt, i) => (
              <motion.li
                key={opt.value}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => {
                  registration.onChange({
                    target: { value: opt.value, name: registration.name },
                  });
                  setOpen(false);
                }}
                className="px-4 py-3 text-19 cursor-pointer select-none hover:opacity-60"
                style={{
                  color: "var(--text-secondary)",
                  opacity: opt.value === value ? 0.5 : 1,
                }}
              >
                {opt.label}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* Error */}
      <div className="h-[20px] mt-1">
        <div
          className={`transition-opacity duration-150 ${
            error ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ErrorMessage message={error ?? ""} />
        </div>
      </div>
    </div>
  );
};