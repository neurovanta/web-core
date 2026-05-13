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
            gsap.set(chars, {
              xPercent: -8,
              opacity: 0,
              clipPath: "inset(0 100% 0 0)",
            });
            tl.to(chars, {
              xPercent: 0,
              opacity: 1,
              clipPath: "inset(0 0% 0 0)",
              duration: 0.95,
              stagger: 0.055,
              onComplete: () => {
                gsap.set(chars, { clearProps: "all" });
                el.querySelectorAll<HTMLElement>(".ah-word-wrap").forEach(
                  (w) => {
                    w.style.overflow = "visible";
                  },
                );
              },
            });
          } else {
            const words = el.querySelectorAll<HTMLElement>(".ah-word-inner");
            gsap.set(words, {
              xPercent: -8,
              opacity: 0,
              clipPath: "inset(0 100% 0 0)",
            });
            tl.to(words, {
              xPercent: 0,
              opacity: 1,
              clipPath: "inset(0 0% 0 0)",
              duration: 1.1,
              stagger: 0.13,
              onComplete: () => {
                gsap.set(words, { clearProps: "all" });
                el.querySelectorAll<HTMLElement>(".ah-word-wrap").forEach(
                  (w) => {
                    w.style.overflow = "visible";
                  },
                );
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
          gsap.set(inners, {
            xPercent: 9,
            yPercent: 60,
            skewX: -14,
            opacity: 0,
          });
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
          const tops = el.querySelectorAll<HTMLElement>(".ah-split-top");
          const bots = el.querySelectorAll<HTMLElement>(".ah-split-bot");
          const wraps = el.querySelectorAll<HTMLElement>(".ah-word-wrap");

          gsap.set(tops, { yPercent: -55, opacity: 1 });
          gsap.set(bots, { yPercent: 55, opacity: 1 });

          tl.to([tops, bots], {
            yPercent: 0,
            duration: 1.1,
            stagger: { each: 0.1, amount: 0.3 },
            ease: "expo.inOut",
            onComplete: () => {
              gsap.set(tops, { opacity: 0, clearProps: "yPercent,transform" });
              gsap.set(bots, { clearProps: "all" });
              wraps.forEach((w) => {
                w.style.overflow = "visible";
              });
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
          gsap.set(inners, {
            scale: 1.09,
            opacity: 0,
            transformOrigin: "50% 50%",
          });
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
      { threshold: 0.15 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      ctx?.revert();
    };
  }, [title, mode, delay, isSingleWordBlade]);

  const words = title.split(" ");

  const charModes = new Set(["cascade"]);
  const wordInnerModes = new Set(["reveal", "shear", "rise", "trace", "stamp"]);
  const wholeElModes = new Set(["unveil"]);

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
        : /* ── SPLIT — two clipped halves per word ── */
          mode === "split"
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
                  {!isLast && <span style={{ display: "inline" }}> </span>}
                </span>
              );
            })
          : /* ── ALL OTHER MODES ── */
            words.map((word, wi) => {
              const isLast = wi === words.length - 1;
              const spacer = !isLast ? (
                <span key={`sp-${wi}`} style={{ display: "inline" }}>
                  {" "}
                </span>
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
                          mode === "rise" || mode === "reveal"
                            ? "hidden"
                            : "visible",
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
