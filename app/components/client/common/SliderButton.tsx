"use client";

import Image from "next/image";

interface SliderNavButtonProps {
  direction: "prev" | "next";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function SliderNavButton({
  direction,
  onClick,
  disabled,
  className = "",
}: SliderNavButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
      className={`
        flex items-center justify-center rounded-full shrink-0 cursor-pointer active:scale-95
        w-[40px] h-[40px]
        sm:w-[45px] sm:h-[45px]
        xl:w-[50px] xl:h-[50px]
        bg-secondary
        disabled:opacity-40 disabled:cursor-not-allowed
        transition-all duration-200
        ${className}
      `}
    >
      <div
        className={`relative w-[9px] h-[18px] xl:w-[12px] xl:h-[20px] transition-transform duration-500 ${
          direction === "next" ? "rotate-180" : ""
        }`}
      >
        <Image
          src="/assets/icons/slider-arrow.svg"
          alt={direction}
          fill
          className="object-contain"
        />
      </div>
    </button>
  );
}
