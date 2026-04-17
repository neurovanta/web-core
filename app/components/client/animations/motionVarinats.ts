import type { Variants } from "framer-motion";
import type { Easing } from "framer-motion";

// motionVariants.ts
export const containerStagger = {
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const moveUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -50,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  reset: { opacity: 0, y: 50 },
});

export const moveUpV2 = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

export const moveUpV3 = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

export const moveDown = (delay: number = 0) => ({
  hidden: { opacity: 0, y: -50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      delay: delay,
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
});

export const moveLeft = (delay: number = 0) => ({
  hidden: { opacity: 0, x: 50 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      delay: delay,
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
});

export const moveRight = (delay: number = 0) => ({
  hidden: { opacity: 0, x: -50 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      delay: delay,
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
});

export const fadeIn = (delay: number = 0) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delay: delay,
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
});

export const paragraphItem = {
  hidden: { opacity: 0, y: 50 }, // Start with opacity 0 and slide up from 50px below
  show: {
    opacity: 1,
    y: 0, // Slide to its normal position
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      staggerChildren: 0.1,
    },
  },
};

export const opacityMove = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export const listUpMove = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Controls the stagger effect (delay for each item)
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
};

export const letterContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05, // a little more time between letters
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
};

export const letterItem = {
  hidden: { y: "100%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: {
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      duration: 0.5,
    },
  },
};

export const letterItemTop = {
  hidden: {
    y: -40, // Start from top
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // cubic-bezier for a soft easeOut
    },
  },
};

// moveUp exit
export const moveUpExit = {
  exit: {
    opacity: 0,
    y: -40,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
};

export const bgFadeAnim = {
  initial: { opacity: 0, scale: 1.03, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.01,
    },
  },
} as const;

const easeInOutCubic: Easing = [0.25, 0.1, 0.25, 1];
const easeExit: Easing = [0.4, 0.0, 1, 1];

export const textFade: Variants = {
  initial: {
    opacity: 0,
    y: 50,
  },

  animate: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: custom,
      ease: easeInOutCubic, // ☑ typed, no any
    },
  }),

  exit: {
    opacity: 0,
    y: -25,
    transition: {
      duration: 0.5,
      ease: easeExit, // ☑ typed, no any
    },
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: d },
  }),
  reset: { opacity: 0, y: 40 }, // ⭐ NEW
};

export const itemVariants = {
  hidden: (_i: number) => ({ opacity: 0, y: 24 }),
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.62, 0.05, 0.01, 0.99] as [number, number, number, number],
    },
  }),
  exit: (_i: number) => ({
    opacity: 0,
    y: -16,
    transition: { duration: 0.25, ease: easeInOutCubic },
  }),
};
