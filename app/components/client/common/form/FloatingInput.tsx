"use client";

import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";

interface FloatingInputProps {
  label: string;
  id: string;
  type?: string;
  registration: UseFormRegisterReturn;
  error?: string;
  value?: string;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  id,
  type = "text",
  registration,
  error,
  value,
}) => {
  const hasValue = value && value.trim().length > 0;

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

      {/* Input */}
      <input
        id={id}
        type={type}
        {...registration}
        className={`
          w-full bg-transparent border-0 border-b outline-none
          text-secondary text-19
          pt-4 md:pt-[30px]
          transition-colors duration-200
          ${error ? "border-b-red-500" : "border-b-secondary"}
        `}
      />

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
