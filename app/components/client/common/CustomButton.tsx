// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useRef, useState, useEffect, useCallback } from "react";

// type CustomButtonProps = {
//   label: string;
//   href?: string;
//   onClick?: () => void;
//   variant?: 1 | 2 | 3;
// };

// const variantStyles: Record<
//   number,
//   { wrapper: string; circle: string; text: string }
// > = {
//   1: {
//     wrapper: "border border-primary",
//     circle: "bg-primary",
//     text: "text-primary",
//   },
//   2: {
//     wrapper: "border border-secondary",
//     circle: "bg-primary",
//     text: "text-secondary",
//   },
//   3: {
//     wrapper: "border border-secondary",
//     circle: "bg-cream-bg",
//     text: "text-secondary",
//   },
// };

// const CIRCLE = 50;
// // difference between default pl-14 and hover pl-20
// const TEXT_NUDGE = 6;

// export default function CustomButton({
//   label,
//   href,
//   onClick,
//   variant = 1,
// }: CustomButtonProps) {
//   const v = variantStyles[variant];
//   const pillRef = useRef<HTMLSpanElement>(null);
//   const [hovered, setHovered] = useState(false);
//   const travelRef = useRef(0);

//   const measure = useCallback(() => {
//     if (pillRef.current) {
//       travelRef.current = pillRef.current.offsetWidth - CIRCLE + 2;
//     }
//   }, []);

//   useEffect(() => {
//     measure();
//     window.addEventListener("resize", measure);
//     return () => window.removeEventListener("resize", measure);
//   }, [measure]);

//   const handleMouseEnter = () => setHovered(true);
//   const handleMouseLeave = () => setHovered(false);

//   const circleTravel = hovered ? travelRef.current : 0;
//   // text slides left by CIRCLE, then nudges right by TEXT_NUDGE to land at pl-20
//   const textTravel = hovered ? -(CIRCLE - TEXT_NUDGE) : 0;

//   const content = (
//     <span
//       ref={pillRef}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//       className={`relative inline-flex items-center rounded-full cursor-pointer overflow-visible 3xl:h-[50px] ${v.wrapper}`}
//     >
//       {/* Circle */}
//       <span
//         className={`relative flex items-center justify-center w-[50px] h-[50px] rounded-full shrink-0 -m-[1px] transition-transform duration-500 ease-in-out z-10 ${v.circle}`}
//         style={{ transform: `translateX(${circleTravel}px)` }}
//       >
//         <Image
//           src="/assets/icons/arrow-right-tip.svg"
//           alt="arrow-right-tip"
//           width={20}
//           height={20}
//           className="h-5 w-auto pointer-events-none"
//         />
//       </span>

//       {/* Text — fixed padding, pure translateX, no layout shift */}
//       <span
//         className={`uppercase text-15 pl-[14px] pr-[20px] transition-transform duration-500 ease-in-out w-fit pt-[1px] ${v.text}`}
//         style={{ transform: `translateX(${textTravel}px)` }}
//       >
//         {label}
//       </span>
//     </span>
//   );

//   if (href) return <Link href={href}>{content}</Link>;
//   return <button onClick={onClick}>{content}</button>;
// }





// "use client";

// import Link from "next/link";
// import { useRef, useState, useEffect, useCallback } from "react";

// type CustomButtonProps = {
//   label: string;
//   href?: string;
//   onClick?: () => void;
//   variant?: 1 | 2 | 3;
// };

// const variantStyles: Record<
//   number,
//   {
//     wrapper: string;
//     circle: string;
//     text: string;
//     pillBg: string;
//     iconClass?: string;
//   }
// > = {
//   1: {
//     wrapper: "border border-primary",
//     circle: "bg-primary group-hover:bg-secondary",
//     text: "text-primary group-hover:text-secondary",
//     pillBg: "bg-primary",
//     iconClass: "stroke-secondary group-hover:stroke-primary",
//   },
//   2: {
//     wrapper: "border border-secondary",
//     circle: "bg-primary group-hover:bg-secondary",
//     text: "text-secondary",
//     pillBg: "bg-primary",
//     iconClass: "stroke-secondary group-hover:stroke-primary",
//   },
//   3: {
//     wrapper: "border border-secondary",
//     circle: "bg-cream-bg group-hover:bg-secondary",
//     text: "text-secondary",
//     pillBg: "bg-cream-bg",
//     iconClass: "stroke-secondary group-hover:stroke-primary",
//   },
// };

// const CIRCLE = 50;
// // difference between default pl-14 and hover pl-20
// const TEXT_NUDGE = 6;

// export default function CustomButton({
//   label,
//   href,
//   onClick,
//   variant = 1,
// }: CustomButtonProps) {
//   const v = variantStyles[variant];
//   const pillRef = useRef<HTMLSpanElement>(null);
//   const [hovered, setHovered] = useState(false);
//   const travelRef = useRef(0);

//   const measure = useCallback(() => {
//     if (pillRef.current) {
//       travelRef.current = pillRef.current.offsetWidth - CIRCLE + 2;
//     }
//   }, []);

//   useEffect(() => {
//     measure();
//     window.addEventListener("resize", measure);
//     return () => window.removeEventListener("resize", measure);
//   }, [measure]);

//   const handleMouseEnter = () => setHovered(true);
//   const handleMouseLeave = () => setHovered(false);

//   const circleTravel = hovered ? travelRef.current : 0;
//   // text slides left by CIRCLE, then nudges right by TEXT_NUDGE to land at pl-20
//   const textTravel = hovered ? -(CIRCLE - TEXT_NUDGE) : 0;

//   const content = (
//     <span
//       ref={pillRef}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//       className={`relative inline-flex group items-center rounded-full cursor-pointer overflow-visible 3xl:h-[50px] ${v.wrapper}`}
//     >
//       <span
//         className={`absolute -inset-[1px] rounded-full ${hovered ? "w-[100%]" : "w-[40px] sm:w-[50px]"} h-[40px] sm:h-[50px] z-[1] duration-500 ease-in-out ${v.pillBg}`}
//       />

//       {/* Circle — z-10 keeps it above the fill at all times */}
//       <span
//         className={`relative flex items-center justify-center w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full shrink-0 -m-[1px] transition-all duration-500 ease-in-out z-10 ${v.circle}`}
//         style={{ transform: `translateX(${circleTravel}px)` }}
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="12"
//           height="20"
//           viewBox="0 0 12 20"
//           fill="none"
//         >
//           <path
//             d="M1 1L10 10L1 19"
//             className={`${v.iconClass} transition-colors duration-300`}
//             strokeWidth="2"
//             strokeLinecap="round"
//           />
//         </svg>
//       </span>

//       {/* Text — z-[5] keeps it above the fill but below the circle */}
//       <span
//         className={`relative z-[5] uppercase text-15 pl-[14px] pr-[20px] transition-all duration-400 ease-in-out w-fit pt-[1px] ${v.text}`}
//         style={{ transform: `translateX(${textTravel}px)` }}
//       >
//         {label}
//       </span>
//     </span>
//   );

//   if (href) return <Link href={href}>{content}</Link>;
//   return <button onClick={onClick}>{content}</button>;
// }





// "use client";

// import Link from "next/link";
// import { useRef, useState, useEffect, useCallback } from "react";

// type CustomButtonProps = {
//   label: string;
//   href?: string;
//   onClick?: () => void;
//   variant?: 1 | 2 | 3;
// };

// const variantStyles: Record<
//   number,
//   {
//     wrapper: string;
//     circle: string;
//     text: string;
//     pillBg: string;
//     iconClass?: string;
//   }
// > = {
//   1: {
//     wrapper: "border border-primary",
//     circle: "bg-primary group-hover:bg-secondary",
//     text: "text-primary group-hover:text-secondary",
//     pillBg: "bg-primary",
//     iconClass: "stroke-secondary group-hover:stroke-primary",
//   },
//   2: {
//     wrapper: "border border-secondary",
//     circle: "bg-primary group-hover:bg-secondary",
//     text: "text-secondary",
//     pillBg: "bg-primary",
//     iconClass: "stroke-secondary group-hover:stroke-primary",
//   },
//   3: {
//     wrapper: "border border-secondary",
//     circle: "bg-cream-bg group-hover:bg-secondary",
//     text: "text-secondary",
//     pillBg: "bg-cream-bg",
//     iconClass: "stroke-secondary group-hover:stroke-primary",
//   },
// };

// const CIRCLE = 50;
// const TEXT_NUDGE = 6;

// export default function CustomButton({
//   label,
//   href,
//   onClick,
//   variant = 1,
// }: CustomButtonProps) {
//   const v = variantStyles[variant];
//   const pillRef = useRef<HTMLSpanElement>(null);
//   const [hovered, setHovered] = useState(false);
//   const [pillWidth, setPillWidth] = useState(0);

//   const measure = useCallback(() => {
//     if (pillRef.current) {
//       setPillWidth(pillRef.current.offsetWidth);
//     }
//   }, []);

//   useEffect(() => {
//     measure();
//     window.addEventListener("resize", measure);
//     return () => window.removeEventListener("resize", measure);
//   }, [measure]);

//   const handleMouseEnter = () => setHovered(true);
//   const handleMouseLeave = () => setHovered(false);

//   // Travel = full pill width minus circle size, corrected for the 1px border on each side
//   const circleTravel = hovered ? pillWidth - CIRCLE : 0;
//   const textTravel = hovered ? -(CIRCLE - TEXT_NUDGE) : 0;

//   const content = (
//     <span
//       ref={pillRef}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//       className={`relative inline-flex group items-center rounded-full cursor-pointer overflow-visible 3xl:h-[50px] ${v.wrapper}`}
//     >
//       {/* Fill pill — driven by inline style width so it's a real CSS transition, not a class swap */}
//       <span
//         className={`absolute inset-0 rounded-full ${hovered ? "w-full" : "w-[38px] sm:w-[48px]"}  ${v.pillBg}`}
//         style={{
//           transition: "width 500ms cubic-bezier(0.4, 0, 0.2, 1)",
//         }}
//       />

//       {/* Circle — z-[3] always above fill */}
//       <span
//         className={`relative flex items-center justify-center w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full shrink-0 -m-px transition-colors duration-300 z-[3] ${v.circle}`}
//         style={{
//           transform: `translateX(${circleTravel}px)`,
//           transition: `transform 500ms cubic-bezier(0.4, 0, 0.2, 1), background-color 300ms`,
//         }}
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="12"
//           height="20"
//           viewBox="0 0 12 20"
//           fill="none"
//         >
//           <path
//             d="M1 1L10 10L1 19"
//             className={`${v.iconClass} transition-colors duration-300`}
//             strokeWidth="2"
//             strokeLinecap="round"
//           />
//         </svg>
//       </span>

//       {/* Text — z-[2] above fill, below circle */}
//       <span
//         className={`relative z-[2] uppercase text-15 pl-[14px] pr-[20px] pt-[1px] w-fit ${v.text}`}
//         style={{
//           transform: `translateX(${textTravel}px)`,
//           transition: `transform 500ms cubic-bezier(0.4, 0, 0.2, 1), color 300ms`,
//         }}
//       >
//         {label}
//       </span>
//     </span>
//   );

//   if (href) return <Link href={href}>{content}</Link>;
//   return <button onClick={onClick}>{content}</button>;
// }


"use client";

import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";

type CustomButtonProps = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 1 | 2 | 3;
};

const variantStyles: Record<
  number,
  {
    wrapper: string;
    circle: string;
    text: string;
    pillBg: string;
    iconClass?: string;
  }
> = {
  1: {
    wrapper: "border border-primary",
    circle: "bg-primary group-hover:bg-secondary",
    text: "text-primary group-hover:text-secondary",
    pillBg: "bg-primary",
    iconClass: "stroke-secondary group-hover:stroke-primary",
  },
  2: {
    wrapper: "border border-secondary",
    circle: "bg-primary group-hover:bg-secondary",
    text: "text-secondary",
    pillBg: "bg-primary",
    iconClass: "stroke-secondary group-hover:stroke-primary",
  },
  3: {
    wrapper: "border border-secondary",
    circle: "bg-cream-bg group-hover:bg-secondary",
    text: "text-secondary",
    pillBg: "bg-cream-bg",
    iconClass: "stroke-secondary group-hover:stroke-primary",
  },
};

const CIRCLE = 50;
const TEXT_NUDGE = 6;

export default function CustomButton({
  label,
  href,
  onClick,
  variant = 1,
}: CustomButtonProps) {
  const v = variantStyles[variant];
  const pillRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);
  const [pillWidth, setPillWidth] = useState(0);
  const isTouchDevice = useRef(false);
  const touchActiveRef = useRef(false);

  const measure = useCallback(() => {
    if (pillRef.current) {
      setPillWidth(pillRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    isTouchDevice.current = window.matchMedia("(hover: none)").matches;
  }, []);

  const handleMouseEnter = () => {
    if (isTouchDevice.current) return;
    setHovered(true);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice.current) return;
    setHovered(false);
  };

  // On touch: first tap = activate (hover state), second tap = navigate
  const handleTouchStart = () => {
    if (!isTouchDevice.current) return;
    if (!touchActiveRef.current) {
      // First touch — show hover state, don't navigate yet
      touchActiveRef.current = true;
      setHovered(true);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isTouchDevice.current) return;
    if (touchActiveRef.current && hovered) {
      // Already activated — let the tap through to navigate
      // Reset after navigation
      setTimeout(() => {
        touchActiveRef.current = false;
        setHovered(false);
      }, 300);
    }
  };

  // Reset touch state when tapping outside
  useEffect(() => {
    const handleOutsideTouch = (e: TouchEvent) => {
      if (pillRef.current && !pillRef.current.contains(e.target as Node)) {
        touchActiveRef.current = false;
        setHovered(false);
      }
    };
    document.addEventListener("touchstart", handleOutsideTouch);
    return () => document.removeEventListener("touchstart", handleOutsideTouch);
  }, []);

  const circleTravel = hovered ? pillWidth - CIRCLE : 0;
  const textTravel = hovered ? -(CIRCLE - TEXT_NUDGE) : 0;

  const content = (
    <span
      ref={pillRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`relative inline-flex group items-center rounded-full cursor-pointer overflow-visible 3xl:h-[50px] ${v.wrapper}`}
    >
      {/* Fill pill */}
      <span
        className={`absolute inset-0 rounded-full ${hovered ? "w-full" : "w-[38px] sm:w-[48px]"} ${v.pillBg}`}
        style={{
          transition: "width 500ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {/* Circle */}
      <span
        className={`relative flex items-center justify-center w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full shrink-0 -m-px transition-colors duration-300 z-[3] ${v.circle}`}
        style={{
          transform: `translateX(${circleTravel}px)`,
          transition: `transform 500ms cubic-bezier(0.4, 0, 0.2, 1), background-color 300ms`,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="20"
          viewBox="0 0 12 20"
          fill="none"
        >
          <path
            d="M1 1L10 10L1 19"
            className={`${v.iconClass} transition-colors duration-300`}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>

      {/* Text */}
      <span
        className={`relative z-[2] uppercase text-15 pl-[14px] pr-[20px] pt-[1px] w-fit ${v.text}`}
        style={{
          transform: `translateX(${textTravel}px)`,
          transition: `transform 500ms cubic-bezier(0.4, 0, 0.2, 1), color 300ms`,
        }}
      >
        {label}
      </span>
    </span>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return <button onClick={onClick}>{content}</button>;
}