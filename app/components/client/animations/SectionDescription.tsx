"use client";

import { useEffect, useRef } from "react";

interface SectionDescriptionProps {
  text: string;
  className?: string;
  as?: "p" | "span" | "div";
  delay?: number;
}

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const ensureStyles = () => {
  if (document.getElementById("sd-styles")) return;
  const s = document.createElement("style");
  s.id = "sd-styles";
  s.textContent = `
    .sd-line-wrap  { display: block; overflow: hidden; }
    .sd-line-inner { display: block; transform: translateY(105%); opacity: 0; }
    .sd-line-inner.in { animation: sd-up var(--dur) ${EASE} var(--del) forwards; }
    @keyframes sd-up {
      from { transform: translateY(105%); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
  `;
  document.head.appendChild(s);
};

export function SectionDescription({
  text,
  className = "",
  as: Tag = "p",
  delay = 0.4,
}: SectionDescriptionProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    ensureStyles();

    // Step 1 — render words as plain inline spans to let browser do layout
    el.innerHTML = "";
    text.split(/(\s+)/).forEach((word, i, arr) => {
      const s = document.createElement("span");
      s.style.display = "inline";
      s.textContent = word + (i < arr.length - 1 ? " " : "");
      el.appendChild(s);
    });

    // Step 2 — measure after two rAFs (layout is stable)
    let observer: IntersectionObserver;

    const measure = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const spans = Array.from(el.children) as HTMLElement[];
          const lines: HTMLElement[][] = [];
          let cur: HTMLElement[] = [];
          let lastTop = -1;

          spans.forEach((s) => {
            const top = s.getBoundingClientRect().top;
            if (lastTop !== -1 && Math.abs(top - lastTop) > 4) {
              lines.push(cur);
              cur = [];
            }
            cur.push(s);
            lastTop = top;
          });
          if (cur.length) lines.push(cur);

          // Step 3 — rebuild as clipped line wrappers
          el.innerHTML = "";
          lines.forEach((lineWords, li) => {
            const lineText = lineWords
              .map((s) => s.textContent ?? "")
              .join("")
              .trimEnd();

            const wrap = document.createElement("span");
            wrap.className = "sd-line-wrap";

            const inner = document.createElement("span");
            inner.className = "sd-line-inner";
            inner.style.setProperty("--del", `${delay + li * 0.18}s`);
            inner.style.setProperty("--dur", "0.9s");
            inner.textContent = lineText;

            wrap.appendChild(inner);
            el.appendChild(wrap);
          });

          // Step 4 — trigger on viewport entry
          observer = new IntersectionObserver(
            ([entry]) => {
              if (!entry.isIntersecting) return;
              requestAnimationFrame(() => {
                el.querySelectorAll<HTMLElement>(".sd-line-inner").forEach((s) =>
                  s.classList.add("in")
                );
              });
              observer.disconnect();
            },
            { threshold: 0.1 }
          );
          observer.observe(el);
        });
      });
    };

    measure();

    return () => {
      observer?.disconnect();
      el.textContent = text;
    };
  }, [text, delay]);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLParagraphElement & HTMLSpanElement & HTMLDivElement>}
      className={`text-description ${className}`}
    />
  );
}