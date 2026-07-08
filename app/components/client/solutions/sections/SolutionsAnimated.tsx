// "use client";

// import { useRef, useState, useEffect } from "react";
// import Image from "next/image";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useGSAP } from "@gsap/react";
// import CircleAnimation from "../../common/CircleAnimation";
// import { SolutionType } from "@/app/types/solution";

// gsap.registerPlugin(ScrollTrigger, useGSAP);

// // ─── Config ──────────────────────────────────────────────────────────────────

// const IMG_SIZES = {
//   xs: { w: 56, h: 71 },
//   sm: { w: 80, h: 100 },
//   md: { w: 95, h: 120 },
//   lg: { w: 120, h: 152 },
//   "2xl": { w: 136, h: 172 },
//   "3xl": { w: 200, h: 250 },
// } as const;

// interface StackItem {
//   rotation: number;
//   dx: number;
//   dy: number;
// }

// const STACK_CONFIG: StackItem[] = [
//   { rotation: 0, dx: 0, dy: 0 },
//   { rotation: 17.52, dx: 0, dy: 0 },
//   { rotation: 17.08, dx: 0, dy: 0 },
//   { rotation: -17.52, dx: 0, dy: 0 },
//   { rotation: -17.08, dx: 0, dy: 0 },
//   { rotation: 0, dx: 0, dy: 0 },
// ];

// // ─────────────────────────────────────────────────────────────────────────────

// export default function MoreThanSolutions({
//   data,
// }: {
//   data: SolutionType["fourthSection"];
// }) {
//   const sectionRef = useRef<HTMLElement>(null);
//   const stackRef = useRef<HTMLDivElement>(null);
//   const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
//   const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
//   const mobileSlotRefs = useRef<(HTMLDivElement | null)[]>([]);
//   const titleRef = useRef<HTMLHeadingElement>(null);
//   const descRef = useRef<HTMLParagraphElement>(null);

//   const [{ w: IMG_W, h: IMG_H }, setImgSize] = useState<{
//     w: number;
//     h: number;
//   }>(IMG_SIZES.xs);

//   useEffect(() => {
//     const w = window.innerWidth;
//     if (w >= 1600) setImgSize(IMG_SIZES["3xl"]);
//     else if (w >= 1536) setImgSize(IMG_SIZES["2xl"]);
//     else if (w >= 1024) setImgSize(IMG_SIZES.lg);
//     else if (w >= 768) setImgSize(IMG_SIZES.md);
//     else if (w >= 640) setImgSize(IMG_SIZES.sm);
//   }, []);

//   useGSAP(
//     () => {
//       const section = sectionRef.current;
//       const stack = stackRef.current;
//       const imgs = imgRefs.current.filter(
//         (el): el is HTMLDivElement => el !== null,
//       );
//       const isMobile = window.innerWidth < 640;
//       const slots = (isMobile ? mobileSlotRefs : slotRefs).current.filter(
//         (el): el is HTMLDivElement => el !== null,
//       );

//       if (!section || !stack || imgs.length !== 6 || slots.length !== 6) return;

//       // ── Initial stacked transforms ──
//       imgs.forEach((img, i) => {
//         gsap.set(img, {
//           rotation: STACK_CONFIG[i].rotation,
//           x: STACK_CONFIG[i].dx,
//           y: STACK_CONFIG[i].dy,
//           transformOrigin: "center center",
//           willChange: "transform",
//         });
//       });

//       // ── Hide text initially ──
//       gsap.set([titleRef.current, descRef.current], { autoAlpha: 0, y: 22 });

//       // ── Compute slot→stack deltas (refreshed on resize) ──
//       const getDeltas = () => {
//         const sr = stack.getBoundingClientRect();
//         const scx = sr.left + sr.width / 2;
//         const scy = sr.top + sr.height / 2;
//         return slots.map((slot) => {
//           const r = slot.getBoundingClientRect();
//           return {
//             x: r.left + r.width / 2 - scx,
//             y: r.top + r.height / 2 - scy,
//           };
//         });
//       };

//       // ── Main timeline ──
//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: section,
//           start: "top 60%",
//           end: "top 5%",
//           scrub: 4,
//           invalidateOnRefresh: true,
//         },
//       });

//       // Text fades in during first phase
//       tl.to(
//         [titleRef.current, descRef.current],
//         { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.8, ease: "power2.out" },
//         0,
//       );

//       // Each image peels off and flies to its grid slot
//       imgs.forEach((img, i) => {
//         tl.to(
//           img,
//           {
//             rotation: 0,
//             x: () => getDeltas()[i].x,
//             y: () => getDeltas()[i].y,
//             duration: 0.8,
//             ease: "power3.inOut",
//           },
//           0.05 + i * 0.04,
//         );
//       });
//     },
//     { scope: sectionRef },
//   );

//   return (
//     <section
//       ref={sectionRef}
//       className="relative w-full overflow-hidden bg-white pt-120 pb-120 3xl:pt-150 3xl:pb-150"
//     >
//       {/* Circle Animation — full bleed behind content */}
//       <div className="absolute inset-0 z-20 flex items-center justify-center max-w-[320px] sm:max-w-[600px] lg:max-w-[700px] 3xl:max-w-[969px] mx-auto">
//         <CircleAnimation variant={1} />
//       </div>
//       <div className="container mx-auto z-30 relative">
//         {/* ── Stacked images — zero flow height, overflow visible so GSAP can measure ── */}
//         <div
//           className="flex justify-center"
//           style={{ height: 0, overflow: "visible" }}
//         >
//           <div
//             ref={stackRef}
//             className="relative"
//             style={{ width: IMG_W, height: IMG_H }}
//           >
//             {data.items.map((item, i) => (
//               <div
//                 key={i}
//                 ref={(el) => {
//                   imgRefs.current[i] = el;
//                 }}
//                 className="absolute inset-0 overflow-hidden"
//                 style={{ width: IMG_W, height: IMG_H, zIndex: i + 1 }}
//               >
//                 <Image
//                   src={item.image}
//                   alt={item.imageAlt}
//                   width={IMG_W}
//                   height={IMG_H}
//                   draggable={false}
//                   className="h-full w-full select-none object-cover"
//                   priority={i === 3}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ── Grid: invisible slots + centered text overlay ── */}
//         <div className="relative">
//           {/* ── MOBILE ROWS (below sm only) ── */}

//           {/* Mobile Row 1 */}
//           <div className="sm:hidden relative w-full mb-[180px] h-[131px]">
//             {/* top-center */}
//             <div
//               ref={(el) => {
//                 mobileSlotRefs.current[0] = el;
//               }}
//               className="absolute top-0 left-1/2 -translate-x-1/2"
//               style={{ width: IMG_W, height: IMG_H }}
//             />
//             {/* bottom-left */}
//             <div
//               ref={(el) => {
//                 mobileSlotRefs.current[1] = el;
//               }}
//               className="absolute bottom-0 left-0"
//               style={{ width: IMG_W, height: IMG_H }}
//             />
//             {/* bottom-right */}
//             <div
//               ref={(el) => {
//                 mobileSlotRefs.current[2] = el;
//               }}
//               className="absolute bottom-0 right-0"
//               style={{ width: IMG_W, height: IMG_H }}
//             />
//           </div>

//           {/* Mobile Row 2 */}
//           <div className="sm:hidden relative w-full h-[131px]">
//             {/* top-left */}
//             <div
//               ref={(el) => {
//                 mobileSlotRefs.current[3] = el;
//               }}
//               className="absolute top-0 left-0"
//               style={{ width: IMG_W, height: IMG_H }}
//             />
//             {/* top-right */}
//             <div
//               ref={(el) => {
//                 mobileSlotRefs.current[4] = el;
//               }}
//               className="absolute top-0 right-0"
//               style={{ width: IMG_W, height: IMG_H }}
//             />
//             {/* bottom-center */}
//             <div
//               ref={(el) => {
//                 mobileSlotRefs.current[5] = el;
//               }}
//               className="absolute bottom-0 left-1/2 -translate-x-1/2"
//               style={{ width: IMG_W, height: IMG_H }}
//             />
//           </div>

//           {/* ── DESKTOP ROWS (sm and above) ── */}

//           {/* Row 1 */}
//           <div className="hidden sm:flex justify-between px-225 2xl:px-[300px] mb-200 md:mb-[100px] 2xl:mb-150 3xl:mb-[102px]">
//             {([0, 1] as const).map((i) => (
//               <div
//                 key={i}
//                 ref={(el) => {
//                   slotRefs.current[i] = el;
//                 }}
//                 style={{ width: IMG_W, height: IMG_H }}
//               />
//             ))}
//           </div>

//           {/* Row 2 */}
//           <div className="hidden sm:flex justify-between mb-200 md:mb-[100px] 2xl:mb-[50px] 3xl:mb-0">
//             {([2, 3] as const).map((i) => (
//               <div
//                 key={i}
//                 ref={(el) => {
//                   slotRefs.current[i] = el;
//                 }}
//                 style={{ width: IMG_W, height: IMG_H }}
//               />
//             ))}
//           </div>

//           {/* Row 3 */}
//           <div className="hidden sm:flex justify-center gap-200 2xl:gap-[286px]">
//             {([4, 5] as const).map((i) => (
//               <div
//                 key={i}
//                 ref={(el) => {
//                   slotRefs.current[i] = el;
//                 }}
//                 style={{ width: IMG_W, height: IMG_H }}
//               />
//             ))}
//           </div>

//           {/* Centered text overlay */}
//           <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
//             <h2
//               ref={titleRef}
//               className="text-heading mb-[10px] md:mb-20 max-w-[12ch] lg:max-w-none xl:max-w-[25ch] text-center"
//             >
//               {data.title}
//             </h2>
//             <p
//               ref={descRef}
//               className="max-w-[40ch] md:max-w-[47ch] lg:max-w-[55ch] xl:max-w-[68ch] 3xl:max-w-[75ch] text-center text-description"
//             >
//               {data.description}
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }





"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import CircleAnimation from "../../common/CircleAnimation";
import { SolutionType } from "@/app/types/solution";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── Config ──────────────────────────────────────────────────────────────────

const IMG_SIZES = {
  xs: { w: 56, h: 71 },
  sm: { w: 80, h: 100 },
  md: { w: 95, h: 120 },
  lg: { w: 120, h: 152 },
  "2xl": { w: 136, h: 172 },
  "3xl": { w: 200, h: 250 },
} as const;

interface StackItem {
  rotation: number;
  dx: number;
  dy: number;
}

const STACK_CONFIG: StackItem[] = [
  { rotation: 0, dx: 0, dy: 0 },
  { rotation: 17.52, dx: 0, dy: 0 },
  { rotation: 17.08, dx: 0, dy: 0 },
  { rotation: -17.52, dx: 0, dy: 0 },
  { rotation: -17.08, dx: 0, dy: 0 },
  { rotation: 0, dx: 0, dy: 0 },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function MoreThanSolutions({
  data,
}: {
  data: SolutionType["fourthSection"];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileSlotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const [ready, setReady] = useState(false);

  const [{ w: IMG_W, h: IMG_H }, setImgSize] = useState<{
    w: number;
    h: number;
  }>(IMG_SIZES.xs);

  useEffect(() => {
    const w = window.innerWidth;
    if (w >= 1600) setImgSize(IMG_SIZES["3xl"]);
    else if (w >= 1536) setImgSize(IMG_SIZES["2xl"]);
    else if (w >= 1024) setImgSize(IMG_SIZES.lg);
    else if (w >= 768) setImgSize(IMG_SIZES.md);
    else if (w >= 640) setImgSize(IMG_SIZES.sm);
    setReady(true);
  }, []);

  useGSAP(
    () => {
      if (!ready) return;
      const section = sectionRef.current;
      const stack = stackRef.current;
      const imgs = imgRefs.current.filter(
        (el): el is HTMLDivElement => el !== null,
      );
      const isMobile = window.innerWidth < 640;
      const slots = (isMobile ? mobileSlotRefs : slotRefs).current.filter(
        (el): el is HTMLDivElement => el !== null,
      );

      if (!section || !stack || imgs.length !== 6 || slots.length !== 6) return;

      // ── Initial stacked transforms ──
      imgs.forEach((img, i) => {
        gsap.set(img, {
          rotation: STACK_CONFIG[i].rotation,
          x: STACK_CONFIG[i].dx,
          y: STACK_CONFIG[i].dy,
          transformOrigin: "center center",
          willChange: "transform",
        });
      });

      // ── Hide text initially ──
      gsap.set([titleRef.current, descRef.current], { autoAlpha: 0, y: 22 });

      // ── Compute slot→stack deltas (refreshed on resize) ──
      const getDeltas = () => {
        const sr = stack.getBoundingClientRect();
        const scx = sr.left + sr.width / 2;
        const scy = sr.top + sr.height / 2;
        return slots.map((slot) => {
          const r = slot.getBoundingClientRect();
          return {
            x: r.left + r.width / 2 - scx,
            y: r.top + r.height / 2 - scy,
          };
        });
      };

      // ── Main timeline ──
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          end: "top 5%",
          scrub: 4,
          invalidateOnRefresh: true,
        },
      });

      // Text fades in during first phase
      tl.to(
        [titleRef.current, descRef.current],
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.8, ease: "power2.out" },
        0,
      );

      // Each image peels off and flies to its grid slot
      imgs.forEach((img, i) => {
        tl.to(
          img,
          {
            rotation: 0,
            x: () => getDeltas()[i].x,
            y: () => getDeltas()[i].y,
            duration: 0.8,
            ease: "power3.inOut",
          },
          0.05 + i * 0.04,
        );
      });
    },
    { scope: sectionRef, dependencies: [ready] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-white pt-120 pb-120 3xl:pt-150 3xl:pb-150"
    >
      {/* Circle Animation — full bleed behind content */}
      <div className="absolute inset-0 z-20 flex items-center justify-center max-w-[320px] sm:max-w-[600px] lg:max-w-[700px] 3xl:max-w-[969px] mx-auto">
        <CircleAnimation variant={1} />
      </div>
      <div className="container mx-auto z-30 relative">
        {/* ── Stacked images — zero flow height, overflow visible so GSAP can measure ── */}
        <div
          className="flex justify-center"
          style={{ height: 0, overflow: "visible" }}
        >
          <div
            ref={stackRef}
            className="relative"
            style={{ width: IMG_W, height: IMG_H }}
          >
            {data.items.map((item, i) => (
              <div
                key={i}
                ref={(el) => {
                  imgRefs.current[i] = el;
                }}
                className="absolute inset-0 overflow-hidden"
                style={{ width: IMG_W, height: IMG_H, zIndex: i + 1 }}
              >
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  width={IMG_W}
                  height={IMG_H}
                  draggable={false}
                  className="h-full w-full select-none object-cover"
                  priority={i === 3}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Grid: invisible slots + centered text overlay ── */}
        <div className="relative">
          {/* ── MOBILE ROWS (below sm only) ── */}

          {/* Mobile Row 1 */}
          <div className="sm:hidden relative w-full mb-[180px] h-[131px]">
            {/* top-center */}
            <div
              ref={(el) => {
                mobileSlotRefs.current[0] = el;
              }}
              className="absolute top-0 left-1/2 -translate-x-1/2"
              style={{ width: IMG_W, height: IMG_H }}
            />
            {/* bottom-left */}
            <div
              ref={(el) => {
                mobileSlotRefs.current[1] = el;
              }}
              className="absolute bottom-0 left-0"
              style={{ width: IMG_W, height: IMG_H }}
            />
            {/* bottom-right */}
            <div
              ref={(el) => {
                mobileSlotRefs.current[2] = el;
              }}
              className="absolute bottom-0 right-0"
              style={{ width: IMG_W, height: IMG_H }}
            />
          </div>

          {/* Mobile Row 2 */}
          <div className="sm:hidden relative w-full h-[131px]">
            {/* top-left */}
            <div
              ref={(el) => {
                mobileSlotRefs.current[3] = el;
              }}
              className="absolute top-0 left-0"
              style={{ width: IMG_W, height: IMG_H }}
            />
            {/* top-right */}
            <div
              ref={(el) => {
                mobileSlotRefs.current[4] = el;
              }}
              className="absolute top-0 right-0"
              style={{ width: IMG_W, height: IMG_H }}
            />
            {/* bottom-center */}
            <div
              ref={(el) => {
                mobileSlotRefs.current[5] = el;
              }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2"
              style={{ width: IMG_W, height: IMG_H }}
            />
          </div>

          {/* ── DESKTOP ROWS (sm and above) ── */}

          {/* Row 1 */}
          <div className="hidden sm:flex justify-between px-225 2xl:px-[300px] mb-200 md:mb-[100px] 2xl:mb-150 3xl:mb-[102px]">
            {([0, 1] as const).map((i) => (
              <div
                key={i}
                ref={(el) => {
                  slotRefs.current[i] = el;
                }}
                style={{ width: IMG_W, height: IMG_H }}
              />
            ))}
          </div>

          {/* Row 2 */}
          <div className="hidden sm:flex justify-between mb-200 md:mb-[100px] 2xl:mb-[50px] 3xl:mb-0">
            {([2, 3] as const).map((i) => (
              <div
                key={i}
                ref={(el) => {
                  slotRefs.current[i] = el;
                }}
                style={{ width: IMG_W, height: IMG_H }}
              />
            ))}
          </div>

          {/* Row 3 */}
          <div className="hidden sm:flex justify-center gap-200 2xl:gap-[286px]">
            {([4, 5] as const).map((i) => (
              <div
                key={i}
                ref={(el) => {
                  slotRefs.current[i] = el;
                }}
                style={{ width: IMG_W, height: IMG_H }}
              />
            ))}
          </div>

          {/* Centered text overlay */}
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
            <h2
              ref={titleRef}
              className="text-heading mb-[10px] md:mb-20 max-w-[12ch] lg:max-w-none xl:max-w-[25ch] text-center"
            >
              {data.title}
            </h2>
            <p
              ref={descRef}
              className="max-w-[40ch] md:max-w-[47ch] lg:max-w-[55ch] xl:max-w-[68ch] 3xl:max-w-[75ch] text-center text-description"
            >
              {data.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
