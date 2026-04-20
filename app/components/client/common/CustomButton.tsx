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
//     circleBgDefault: string;
//     circleBgActive: string;
//     textDefault: string;
//     textActive: string;
//     pillBg: string;
//     iconDefault: string;
//     iconActive: string;
//   }
// > = {
//   1: {
//     wrapper: "border border-primary",
//     circleBgDefault: "bg-primary",
//     circleBgActive: "bg-secondary",
//     textDefault: "text-primary",
//     textActive: "text-secondary",
//     pillBg: "bg-primary",
//     iconDefault: "stroke-secondary",
//     iconActive: "stroke-primary",
//   },
//   2: {
//     wrapper: "border border-secondary",
//     circleBgDefault: "bg-primary",
//     circleBgActive: "bg-secondary",
//     textDefault: "text-secondary",
//     textActive: "text-secondary",
//     pillBg: "bg-primary",
//     iconDefault: "stroke-secondary",
//     iconActive: "stroke-primary",
//   },
//   3: {
//     wrapper: "border border-secondary",
//     circleBgDefault: "bg-cream-bg",
//     circleBgActive: "bg-secondary",
//     textDefault: "text-secondary",
//     textActive: "text-secondary",
//     pillBg: "bg-cream-bg",
//     iconDefault: "stroke-secondary",
//     iconActive: "stroke-primary",
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
//   const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

//   // Reset when tapping outside on touch devices
//   useEffect(() => {
//     const handleOutsideTouch = (e: TouchEvent) => {
//       if (pillRef.current && !pillRef.current.contains(e.target as Node)) {
//         setHovered(false);
//       }
//     };
//     document.addEventListener("touchstart", handleOutsideTouch);
//     return () => document.removeEventListener("touchstart", handleOutsideTouch);
//   }, []);

//   // Pointer events work across mouse, touch, and stylus on all browsers/devices
//   const handlePointerEnter = (e: React.PointerEvent) => {
//     // Only mouse/pen get the persistent hover — touch gets a brief flash then navigates
//     if (e.pointerType === "mouse" || e.pointerType === "pen") {
//       setHovered(true);
//     }
//   };

//   const handlePointerLeave = (e: React.PointerEvent) => {
//     if (e.pointerType === "mouse" || e.pointerType === "pen") {
//       setHovered(false);
//     }
//   };

//   const handlePointerDown = (e: React.PointerEvent) => {
//     if (e.pointerType === "touch") {
//       // Animate in
//       setHovered(true);
//       // Reset after navigation delay
//       if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
//       touchTimerRef.current = setTimeout(() => {
//         setHovered(false);
//       }, 600);
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
//     };
//   }, []);

//   const circleTravel = hovered ? pillWidth - CIRCLE : 0;
//   const textTravel = hovered ? -(CIRCLE - TEXT_NUDGE) : 0;

//   const content = (
//     <span
//       ref={pillRef}
//       onPointerEnter={handlePointerEnter}
//       onPointerLeave={handlePointerLeave}
//       onPointerDown={handlePointerDown}
//       className={`relative inline-flex items-center rounded-full cursor-pointer overflow-visible 3xl:h-[50px] ${v.wrapper}`}
//     >
//       {/* Fill pill */}
//       <span
//         className={`absolute inset-0 rounded-full ${v.pillBg}`}
//         style={{
//           width: hovered ? "100%" : "38px",
//           transition: "width 500ms cubic-bezier(0.4, 0, 0.2, 1)",
//         }}
//       />

//       {/* Circle — color driven by hovered state, not group-hover */}
//       <span
//         className={`relative flex items-center justify-center w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full shrink-0 -m-px z-[3] ${
//           hovered ? v.circleBgActive : v.circleBgDefault
//         }`}
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
//             className={`transition-colors duration-300 ${
//               hovered ? v.iconActive : v.iconDefault
//             }`}
//             strokeWidth="2"
//             strokeLinecap="round"
//           />
//         </svg>
//       </span>

//       {/* Text — color driven by hovered state, not group-hover */}
//       <span
//         className={`relative z-[2] uppercase text-15 pl-[14px] pr-[20px] pt-[1px] w-fit transition-colors duration-300 ${
//           hovered ? v.textActive : v.textDefault
//         }`}
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
    circleBgDefault: string;
    circleBgActive: string;
    textDefault: string;
    textActive: string;
    pillBg: string;
    iconDefault: string;
    iconActive: string;
  }
> = {
  1: {
    wrapper: "border border-primary",
    circleBgDefault: "bg-primary",
    circleBgActive: "bg-secondary",
    textDefault: "text-primary",
    textActive: "text-secondary",
    pillBg: "bg-primary",
    iconDefault: "stroke-secondary",
    iconActive: "stroke-primary",
  },
  2: {
    wrapper: "border border-secondary",
    circleBgDefault: "bg-primary",
    circleBgActive: "bg-secondary",
    textDefault: "text-secondary",
    textActive: "text-secondary",
    pillBg: "bg-primary",
    iconDefault: "stroke-secondary",
    iconActive: "stroke-primary",
  },
  3: {
    wrapper: "border border-secondary",
    circleBgDefault: "bg-cream-bg",
    circleBgActive: "bg-secondary",
    textDefault: "text-secondary",
    textActive: "text-secondary",
    pillBg: "bg-cream-bg",
    iconDefault: "stroke-secondary",
    iconActive: "stroke-primary",
  },
};

const TEXT_NUDGE = 6;

export default function CustomButton({
  label,
  href,
  onClick,
  variant = 1,
}: CustomButtonProps) {
  const v = variantStyles[variant];
  const pillRef = useRef<HTMLSpanElement>(null);
  const circleRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);
  const [pillWidth, setPillWidth] = useState(0);
  const [circleSize, setCircleSize] = useState(50);
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const measure = useCallback(() => {
    if (pillRef.current) {
      setPillWidth(pillRef.current.getBoundingClientRect().width);
    }
    if (circleRef.current) {
      setCircleSize(circleRef.current.getBoundingClientRect().width);
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Reset when tapping outside on touch devices
  useEffect(() => {
    const handleOutsideTouch = (e: TouchEvent) => {
      if (pillRef.current && !pillRef.current.contains(e.target as Node)) {
        setHovered(false);
      }
    };
    document.addEventListener("touchstart", handleOutsideTouch);
    return () => document.removeEventListener("touchstart", handleOutsideTouch);
  }, []);

  useEffect(() => {
    return () => {
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    };
  }, []);

  const handlePointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" || e.pointerType === "pen") {
      setHovered(true);
    }
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" || e.pointerType === "pen") {
      setHovered(false);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") {
      // Re-measure right at interaction time — guarantees correct values on touch
      const freshPillWidth = pillRef.current?.getBoundingClientRect().width ?? pillWidth;
      const freshCircleSize = circleRef.current?.getBoundingClientRect().width ?? circleSize;
      setPillWidth(freshPillWidth);
      setCircleSize(freshCircleSize);

      setHovered(true);
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
      touchTimerRef.current = setTimeout(() => {
        setHovered(false);
      }, 600);
    }
  };

  const circleTravel = hovered ? pillWidth - circleSize : 0;
  const textTravel = hovered ? -(circleSize - TEXT_NUDGE) : 0;

  const content = (
    <span
      ref={pillRef}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      className={`relative inline-flex items-center rounded-full cursor-pointer overflow-visible 3xl:h-[50px] ${v.wrapper}`}
    >
      {/* Fill pill */}
      <span
        className={`absolute inset-0 rounded-full ${v.pillBg}`}
        style={{
          width: hovered ? "100%" : `${circleSize - 2}px`,
          transition: "width 500ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {/* Circle */}
      <span
        ref={circleRef}
        className={`relative flex items-center justify-center w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full shrink-0 -m-px z-[3] ${
          hovered ? v.circleBgActive : v.circleBgDefault
        }`}
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
            className={`transition-colors duration-300 ${
              hovered ? v.iconActive : v.iconDefault
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>

      {/* Text */}
      <span
        className={`relative z-[2] uppercase text-15 pl-[14px] pr-[20px] pt-[1px] w-fit transition-colors duration-300 ${
          hovered ? v.textActive : v.textDefault
        }`}
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