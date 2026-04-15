import { RefObject, useEffect, useState } from "react";

export function useContainerInset(
  ref: RefObject<HTMLElement | null>,
  extra = 15
) {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;

    const calculate = () => {
      const rect = el.getBoundingClientRect();
      setInset(rect.left + extra);
    };

    calculate();

    const ro = new ResizeObserver(calculate);
    ro.observe(el);

    return () => ro.disconnect();
  }, [ref, extra]);

  return inset;
}
