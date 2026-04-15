"use client";

import React, { useRef, useEffect } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";

interface FloatingTextareaProps {
  label: string;
  id: string;
  registration: UseFormRegisterReturn;
  error?: string;
  value?: string;
  rows?: number;
}

export const FloatingTextarea: React.FC<FloatingTextareaProps> = ({
  label,
  id,
  registration,
  error,
  value,
  rows = 4,
}) => {
  const hasValue = value && value.trim().length > 0;
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-grow height as user types
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  // Merge react-hook-form ref with our local ref
  const { ref: rhfRef, ...restRegistration } = registration;

  return (
    <div className="relative w-full group">
      {/* Label */}
      <label
        htmlFor={id}
        className={`
          absolute left-0 transition-all duration-300 ease-in-out pointer-events-none
          text-secondary leading-[1.42] select-none
          ${
            hasValue
              ? "-top-[15px] text-15"
              : "text-19 group-focus-within:-top-[15px] group-focus-within:text-15"
          }
        `}
      >
        {label}
      </label>

      {/* Textarea */}
      <textarea
        id={id}
        rows={rows}
        ref={(el) => {
          textareaRef.current = el;
          rhfRef(el);
        }}
        {...restRegistration}
        className={`
          w-full bg-transparent border-0 border-b outline-none resize-none
          text-secondary text-19
          pt-[30px]
          transition-colors duration-300
          overflow-hidden
          ${error ? "border-b-red-500" : "border-b-secondary"}
        `}
      />

      {/* Always-rendered error slot — reserves space to prevent layout jump */}
      <div className="h-[20px] -mt-[6px]">
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