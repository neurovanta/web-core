// "use client";

// import { useEffect, useRef } from "react";
// import gsap from "gsap";

// interface AnimatedHeadingProps {
//   title: string;
//   className?: string;
//   mode?: "blade" | "reveal" | "magnetic" | "cascade" | "cinematic";
//   delay?: number;
// }

// export function AnimatedHeading({
//   title,
//   className = "",
//   mode = "blade",
//   delay = 0,
// }: AnimatedHeadingProps) {
//   const ref = useRef<HTMLHeadingElement>(null);
//   const isSingleWordBlade =
//     mode === "blade" && title.trim().split(" ").length === 1;

//   useEffect(() => {
//     const el = ref.current;
//     if (!el) return;

//     const ctx = gsap.context(() => {
//       const tl = gsap.timeline({ delay, defaults: { ease: "expo.out" } });

//       /* ── BLADE (original) ─────────────────────────────────────────────── */
//       if (mode === "blade") {
//         if (isSingleWordBlade) {
//           const chars = el.querySelectorAll<HTMLElement>(".ah-char-blade");
//           gsap.set(chars, {
//             xPercent: -8,
//             opacity: 0,
//             clipPath: "inset(0 100% 0 0)",
//           });
//           tl.to(chars, {
//             xPercent: 0,
//             opacity: 1,
//             clipPath: "inset(0 0% 0 0)",
//             duration: 0.95,
//             stagger: 0.055,
//             onComplete: () => {
//               gsap.set(chars, { clearProps: "all" });
//               el.querySelectorAll<HTMLElement>(".ah-word-wrap").forEach((w) => {
//                 w.style.overflow = "visible";
//               });
//             },
//           });
//         } else {
//           const words = el.querySelectorAll<HTMLElement>(".ah-word-inner");
//           gsap.set(words, {
//             xPercent: -8,
//             opacity: 0,
//             clipPath: "inset(0 100% 0 0)",
//           });
//           tl.to(words, {
//             xPercent: 0,
//             opacity: 1,
//             clipPath: "inset(0 0% 0 0)",
//             duration: 1.1,
//             stagger: 0.13,
//             onComplete: () => {
//               gsap.set(words, { clearProps: "all" });
//               el.querySelectorAll<HTMLElement>(".ah-word-wrap").forEach((w) => {
//                 w.style.overflow = "visible";
//               });
//             },
//           });
//         }
//       }

//       /* ── REVEAL — editorial mask lift ────────────────────────────────── */
//       /*
//        * Each word sits inside an overflow:hidden wrapper.
//        * The inner span starts yPercent: 105 (fully below the mask)
//        * and rises to 0. No opacity change — purely geometric.
//        * After completion, overflow is set to visible so descenders
//        * and ascenders breathe freely.
//        */
//       if (mode === "reveal") {
//         const inners = el.querySelectorAll<HTMLElement>(".ah-word-inner");
//         gsap.set(inners, { yPercent: 105 });
//         tl.to(inners, {
//           yPercent: 0,
//           duration: 1.05,
//           stagger: 0.1,
//           ease: "expo.out",
//           onComplete: () => {
//             gsap.set(inners, { clearProps: "all" });
//             el.querySelectorAll<HTMLElement>(".ah-word-wrap").forEach((w) => {
//               w.style.overflow = "visible";
//             });
//           },
//         });
//       }

//       /* ── MAGNETIC — scattered chars snap to place ─────────────────────── */
//       /*
//        * Each character starts at a small random x/y offset and 0 opacity,
//        * then snaps precisely to its natural position. The scatter is seeded
//        * per-character so it feels organic, not random-looking every render.
//        * Uses a spring-like elastic ease for the "snap" feeling.
//        */
//       if (mode === "magnetic") {
//         const chars = el.querySelectorAll<HTMLElement>(".ah-char");
//         chars.forEach((char, i) => {
//           // deterministic pseudo-random using index
//           const seed = (i * 137 + 29) % 100;
//           const ox = ((seed % 20) - 10) * 2.2;   // –22 … +22 px
//           const oy = (((seed * 3) % 20) - 10) * 1.4; // –14 … +14 px
//           gsap.set(char, { x: ox, y: oy, opacity: 0, scale: 0.88 });
//         });
//         tl.to(chars, {
//           x: 0,
//           y: 0,
//           opacity: 1,
//           scale: 1,
//           duration: 1.2,
//           stagger: { amount: 0.5, from: "random" },
//           ease: "elastic.out(1, 0.55)",
//           onComplete: () => {
//             gsap.set(chars, { clearProps: "all" });
//           },
//         });
//       }

//       /* ── CASCADE — luxurious sequential char fall ─────────────────────── */
//       /*
//        * Characters start above their natural position (y: -24) + hidden,
//        * and fall into place one by one with a refined power4 ease.
//        * The slight overshoot (yPercent land slightly past 0 then settle)
//        * is handled by the ease curve — no spring, just gravity-elegant.
//        */
//       if (mode === "cascade") {
//         const chars = el.querySelectorAll<HTMLElement>(".ah-char");
//         gsap.set(chars, { y: -28, opacity: 0, rotateX: 40 });
//         tl.to(chars, {
//           y: 0,
//           opacity: 1,
//           rotateX: 0,
//           duration: 0.85,
//           stagger: { amount: 0.65, ease: "power2.in" },
//           ease: "power4.out",
//           onComplete: () => {
//             gsap.set(chars, { clearProps: "all" });
//           },
//         });
//       }

//       /* ── CINEMATIC — scale + letter-spacing collapse ─────────────────── */
//       /*
//        * The whole heading enters at scale 1.06 with letter-spacing pushed
//        * out, then collapses to natural values. This mimics a movie title
//        * card sequence. Uses the element's computed letter-spacing as end
//        * target so inherited styles are always respected.
//        * NOTE: letterSpacing is animated on the h1 itself — no wrappers
//        * needed — so it never affects layout structure.
//        */
//       if (mode === "cinematic") {
//         const computed = window.getComputedStyle(el).letterSpacing;
//         const endLS = parseFloat(computed) || 0; // px value or 0

//         gsap.set(el, {
//           opacity: 0,
//           scale: 1.06,
//           letterSpacing: `${endLS + 6}px`,
//           transformOrigin: "50% 50%",
//         });
//         tl.to(el, {
//           opacity: 1,
//           scale: 1,
//           letterSpacing: `${endLS}px`,
//           duration: 1.6,
//           ease: "power3.out",
//           onComplete: () => {
//             gsap.set(el, { clearProps: "all" });
//           },
//         });
//       }
//     }, el);

//     return () => ctx.revert();
//   }, [title, mode, delay, isSingleWordBlade]);

//   const words = title.split(" ");

//   /* ─── Char-level modes ─── */
//   const charModes = new Set(["magnetic", "cascade"]);
//   /* ─── Word-level modes ─── */
//   const wordInnerModes = new Set(["reveal"]);
//   /* ─── Whole-element modes (no wrappers needed) ─── */
//   const wholeModes = new Set(["cinematic"]);

//   return (
//     <h1
//       ref={ref}
//       className={`text-heading ${className}`}
//       /**
//        * Intentionally NO extra styles here.
//        * line-height, font-size, tracking, color — all come from className
//        * or the cascade, exactly as they would on a plain <h1>.
//        */
//     >
//       {wholeModes.has(mode)
//         ? /* cinematic: render plain text, animate the h1 directly */
//           title
//         : words.map((word, wi) => {
//             const isLast = wi === words.length - 1;

//             /* Word separator — using a real space span that never animates */
//             const spacer = !isLast ? (
//               <span
//                 key={`sp-${wi}`}
//                 aria-hidden="true"
//                 style={{
//                   display: "inline-block",
//                   width: "0.3em",
//                   // explicitly NOT adding overflow:hidden so it never clips
//                 }}
//               />
//             ) : null;

//             /* ── BLADE ── */
//             if (mode === "blade") {
//               return (
//                 <span key={wi} style={{ display: "inline" }}>
//                   <span
//                     className="ah-word-wrap"
//                     style={{
//                       display: "inline-block",
//                       overflow: "hidden",
//                       verticalAlign: "top",
//                     }}
//                   >
//                     {isSingleWordBlade ? (
//                       [...word].map((char, ci) => (
//                         <span
//                           key={ci}
//                           style={{
//                             display: "inline-block",
//                             overflow: "hidden",
//                             verticalAlign: "top",
//                           }}
//                         >
//                           <span
//                             className="ah-char-blade"
//                             style={{ display: "inline-block" }}
//                           >
//                             {char}
//                           </span>
//                         </span>
//                       ))
//                     ) : (
//                       <span
//                         className="ah-word-inner"
//                         style={{ display: "inline-block" }}
//                       >
//                         {word}
//                       </span>
//                     )}
//                   </span>
//                   {spacer}
//                 </span>
//               );
//             }

//             /* ── REVEAL ── */
//             if (wordInnerModes.has(mode)) {
//               return (
//                 <span key={wi} style={{ display: "inline" }}>
//                   <span
//                     className="ah-word-wrap"
//                     style={{
//                       display: "inline-block",
//                       overflow: "hidden",
//                       verticalAlign: "top",
//                       /*
//                        * lineHeight must stay "normal" so the clip box
//                        * matches the actual rendered line box. We let it
//                        * inherit from the parent <h1>.
//                        */
//                     }}
//                   >
//                     <span
//                       className="ah-word-inner"
//                       style={{ display: "inline-block" }}
//                     >
//                       {word}
//                     </span>
//                   </span>
//                   {spacer}
//                 </span>
//               );
//             }

//             /* ── MAGNETIC / CASCADE — char-level ── */
//             if (charModes.has(mode)) {
//               return (
//                 <span key={wi} style={{ display: "inline" }}>
//                   {[...word].map((char, ci) => (
//                     <span
//                       key={ci}
//                       className="ah-char"
//                       style={{
//                         display: "inline-block",
//                         /*
//                          * perspectiveOrigin on the wrapper keeps
//                          * rotateX natural for cascade mode.
//                          */
//                         perspective: "400px",
//                       }}
//                     >
//                       {char}
//                     </span>
//                   ))}
//                   {spacer}
//                 </span>
//               );
//             }

//             return null;
//           })}
//     </h1>
//   );
// }




"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface AnimatedHeadingProps {
  title: string;
  className?: string;
  mode?:
    | "blade"
    | "reveal"
    | "cascade"
    | "shear"
    | "split"
    | "rise"
    | "trace"
    | "stamp"
    | "unveil";
  delay?: number;
}

export function AnimatedHeading({
  title,
  className = "",
  mode = "reveal",
  delay = 0,
}: AnimatedHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isSingleWordBlade =
    mode === "blade" && title.trim().split(" ").length === 1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ctx: gsap.Context | null = null;

    const run = () => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay, defaults: { ease: "expo.out" } });

        /* ── BLADE ─────────────────────────────────────────────────────── */
        if (mode === "blade") {
          if (isSingleWordBlade) {
            const chars = el.querySelectorAll<HTMLElement>(".ah-char-blade");
            gsap.set(chars, { xPercent: -8, opacity: 0, clipPath: "inset(0 100% 0 0)" });
            tl.to(chars, {
              xPercent: 0,
              opacity: 1,
              clipPath: "inset(0 0% 0 0)",
              duration: 0.95,
              stagger: 0.055,
              onComplete: () => {
                gsap.set(chars, { clearProps: "all" });
                el.querySelectorAll<HTMLElement>(".ah-word-wrap").forEach((w) => {
                  w.style.overflow = "visible";
                });
              },
            });
          } else {
            const words = el.querySelectorAll<HTMLElement>(".ah-word-inner");
            gsap.set(words, { xPercent: -8, opacity: 0, clipPath: "inset(0 100% 0 0)" });
            tl.to(words, {
              xPercent: 0,
              opacity: 1,
              clipPath: "inset(0 0% 0 0)",
              duration: 1.1,
              stagger: 0.13,
              onComplete: () => {
                gsap.set(words, { clearProps: "all" });
                el.querySelectorAll<HTMLElement>(".ah-word-wrap").forEach((w) => {
                  w.style.overflow = "visible";
                });
              },
            });
          }
        }

        /* ── REVEAL — editorial mask lift ──────────────────────────────── */
        if (mode === "reveal") {
          const inners = el.querySelectorAll<HTMLElement>(".ah-word-inner");
          gsap.set(inners, { yPercent: 105 });
          tl.to(inners, {
            yPercent: 0,
            duration: 1.05,
            stagger: 0.1,
            ease: "expo.out",
            onComplete: () => {
              gsap.set(inners, { clearProps: "all" });
              el.querySelectorAll<HTMLElement>(".ah-word-wrap").forEach((w) => {
                w.style.overflow = "visible";
              });
            },
          });
        }

        /* ── CASCADE — chars fall from above with rotateX ───────────────── */
        if (mode === "cascade") {
          const chars = el.querySelectorAll<HTMLElement>(".ah-char");
          gsap.set(chars, { y: -28, opacity: 0, rotateX: 40 });
          tl.to(chars, {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.85,
            stagger: { amount: 0.65, ease: "power2.in" },
            ease: "power4.out",
            onComplete: () => {
              gsap.set(chars, { clearProps: "all" });
            },
          });
        }

        /* ── SHEAR — diagonal skew slide per word ───────────────────────── */
        if (mode === "shear") {
          const inners = el.querySelectorAll<HTMLElement>(".ah-word-inner");
          gsap.set(inners, { xPercent: 9, yPercent: 60, skewX: -14, opacity: 0 });
          tl.to(inners, {
            xPercent: 0,
            yPercent: 0,
            skewX: 0,
            opacity: 1,
            duration: 1.0,
            stagger: 0.11,
            ease: "expo.out",
            onComplete: () => {
              gsap.set(inners, { clearProps: "all" });
              el.querySelectorAll<HTMLElement>(".ah-word-wrap").forEach((w) => {
                w.style.overflow = "visible";
              });
            },
          });
        }

        /* ── SPLIT — halves converge from outside in ────────────────────── */
        /*
         * .ah-split-top is absolutely positioned + aria-hidden.
         * .ah-split-bot drives layout and is the only visible copy at rest.
         * After animation: top opacity → 0, bot clearProps removes clipPath
         * so the full word renders normally. No duplicate text visible.
         */
        if (mode === "split") {
          const tops  = el.querySelectorAll<HTMLElement>(".ah-split-top");
          const bots  = el.querySelectorAll<HTMLElement>(".ah-split-bot");
          const wraps = el.querySelectorAll<HTMLElement>(".ah-word-wrap");

          gsap.set(tops, { yPercent: -55, opacity: 1 });
          gsap.set(bots, { yPercent:  55, opacity: 1 });

          tl.to([tops, bots], {
            yPercent: 0,
            duration: 1.1,
            stagger: { each: 0.1, amount: 0.3 },
            ease: "expo.inOut",
            onComplete: () => {
              gsap.set(tops, { opacity: 0, clearProps: "yPercent,transform" });
              gsap.set(bots, { clearProps: "all" });
              wraps.forEach((w) => { w.style.overflow = "visible"; });
            },
          });
        }

        /* ── RISE — words lift cleanly from below, circ ease ───────────── */
        /*
         * Like reveal but with a harder circ.out curve and a tighter
         * stagger — feels more architectural and decisive.
         */
        if (mode === "rise") {
          const inners = el.querySelectorAll<HTMLElement>(".ah-word-inner");
          gsap.set(inners, { yPercent: 110, opacity: 0 });
          tl.to(inners, {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.08,
            ease: "circ.out",
            onComplete: () => {
              gsap.set(inners, { clearProps: "all" });
              el.querySelectorAll<HTMLElement>(".ah-word-wrap").forEach((w) => {
                w.style.overflow = "visible";
              });
            },
          });
        }

        /* ── TRACE — words slide from a fixed x offset with fade ─────────── */
        /*
         * Each word starts 22px right at opacity 0, translates to x:0.
         * No clip mask. Ultra-minimal — feels like a gentle settle.
         */
        if (mode === "trace") {
          const inners = el.querySelectorAll<HTMLElement>(".ah-word-inner");
          gsap.set(inners, { x: 22, opacity: 0 });
          tl.to(inners, {
            x: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.1,
            ease: "power4.out",
            onComplete: () => {
              gsap.set(inners, { clearProps: "all" });
            },
          });
        }

        /* ── STAMP — words press in from scale 1.09 → 1 ─────────────────── */
        /*
         * Each word enters slightly enlarged and settles to natural size
         * while fading in. Symmetric transformOrigin. No layout shift.
         * power3.out gives the quick-deceleration "pressing down" feel.
         */
        if (mode === "stamp") {
          const inners = el.querySelectorAll<HTMLElement>(".ah-word-inner");
          gsap.set(inners, { scale: 1.09, opacity: 0, transformOrigin: "50% 50%" });
          tl.to(inners, {
            scale: 1,
            opacity: 1,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
            onComplete: () => {
              gsap.set(inners, { clearProps: "all" });
            },
          });
        }

        /* ── UNVEIL — single clip-path sweep across the whole heading ───── */
        /*
         * Animates clipPath on the <h1> itself in one unified left-to-right
         * wipe. No per-word structure. Plain text children only.
         * clearProps removes clipPath at rest so nothing stays masked.
         */
        if (mode === "unveil") {
          gsap.set(el, { clipPath: "inset(0 100% 0 0)" });
          tl.to(el, {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.2,
            ease: "expo.inOut",
            onComplete: () => {
              gsap.set(el, { clearProps: "clipPath" });
            },
          });
        }
      }, el);
    };

    /* ── IntersectionObserver — fires once on viewport entry ────────────── */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(el);
            run();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      ctx?.revert();
    };
  }, [title, mode, delay, isSingleWordBlade]);

  const words = title.split(" ");

  const charModes      = new Set(["cascade"]);
  const wordInnerModes = new Set(["reveal", "shear", "rise", "trace", "stamp"]);
  const wholeElModes   = new Set(["unveil"]);

  return (
    <h1
      ref={ref}
      className={`text-heading ${className}`}
      /*
       * Zero layout styles on the element itself.
       * line-height, font-size, tracking, color, max-width — all from
       * className or the cascade, exactly as a plain <h1>.
       */
    >
      {/* ── UNVEIL — plain text, h1 element animated directly ── */}
      {wholeElModes.has(mode)
        ? title

        /* ── SPLIT — two clipped halves per word ── */
        : mode === "split"
        ? words.map((word, wi) => {
            const isLast = wi === words.length - 1;
            return (
              <span key={wi} style={{ display: "inline" }}>
                <span
                  className="ah-word-wrap"
                  style={{
                    display: "inline-block",
                    overflow: "hidden",
                    verticalAlign: "top",
                    position: "relative",
                  }}
                >
                  {/*
                   * Top half — absolute, aria-hidden, pointer-events none.
                   * Visible only during animation; opacity → 0 on complete.
                   */}
                  <span
                    className="ah-split-top"
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      display: "inline-block",
                      clipPath: "inset(0 0 50% 0)",
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    {word}
                  </span>
                  {/*
                   * Bottom half — drives layout width and line height.
                   * clipPath removed by clearProps on complete; full word
                   * becomes visible and this is the sole readable copy.
                   */}
                  <span
                    className="ah-split-bot"
                    style={{
                      display: "inline-block",
                      clipPath: "inset(50% 0 0 0)",
                    }}
                  >
                    {word}
                  </span>
                </span>
                {!isLast && (
                  <span
                    aria-hidden="true"
                    style={{ display: "inline-block", width: "0.3em" }}
                  />
                )}
              </span>
            );
          })

        /* ── ALL OTHER MODES ── */
        : words.map((word, wi) => {
            const isLast = wi === words.length - 1;
            const spacer = !isLast ? (
              <span
                key={`sp-${wi}`}
                aria-hidden="true"
                style={{ display: "inline-block", width: "0.3em" }}
              />
            ) : null;

            /* BLADE */
            if (mode === "blade") {
              return (
                <span key={wi} style={{ display: "inline" }}>
                  <span
                    className="ah-word-wrap"
                    style={{
                      display: "inline-block",
                      overflow: "hidden",
                      verticalAlign: "top",
                    }}
                  >
                    {isSingleWordBlade ? (
                      [...word].map((char, ci) => (
                        <span
                          key={ci}
                          style={{
                            display: "inline-block",
                            overflow: "hidden",
                            verticalAlign: "top",
                          }}
                        >
                          <span
                            className="ah-char-blade"
                            style={{ display: "inline-block" }}
                          >
                            {char}
                          </span>
                        </span>
                      ))
                    ) : (
                      <span
                        className="ah-word-inner"
                        style={{ display: "inline-block" }}
                      >
                        {word}
                      </span>
                    )}
                  </span>
                  {spacer}
                </span>
              );
            }

            /* WORD-INNER MODES: reveal / shear / rise / trace / stamp */
            if (wordInnerModes.has(mode)) {
              return (
                <span key={wi} style={{ display: "inline" }}>
                  <span
                    className="ah-word-wrap"
                    style={{
                      display: "inline-block",
                      overflow:
                        mode === "rise" || mode === "reveal" ? "hidden" : "visible",
                      verticalAlign: "top",
                    }}
                  >
                    <span
                      className="ah-word-inner"
                      style={{ display: "inline-block" }}
                    >
                      {word}
                    </span>
                  </span>
                  {spacer}
                </span>
              );
            }

            /* CASCADE — char level */
            if (charModes.has(mode)) {
              return (
                <span key={wi} style={{ display: "inline" }}>
                  {[...word].map((char, ci) => (
                    <span
                      key={ci}
                      className="ah-char"
                      style={{
                        display: "inline-block",
                        perspective: "400px",
                      }}
                    >
                      {char}
                    </span>
                  ))}
                  {spacer}
                </span>
              );
            }

            return null;
          })}
    </h1>
  );
}