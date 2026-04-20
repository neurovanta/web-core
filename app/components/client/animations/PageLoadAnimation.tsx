// "use client";

// import { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { motion } from "framer-motion";

// interface PageLoadAnimationProps {
//   onComplete: () => void;
// }

// export default function PageLoadAnimation({ onComplete }: PageLoadAnimationProps) {
//   const [revealLogo, setRevealLogo] = useState(false);
//   const [wipeActive, setWipeActive] = useState(false);
//   const [fadeLogo, setFadeLogo] = useState(false);
//   const [visible, setVisible] = useState(true);
//   const onCompleteRef = useRef(onComplete);
//   onCompleteRef.current = onComplete;

//   useEffect(() => {
//     const raf = requestAnimationFrame(() => setRevealLogo(true));

//     // Wait after reveal completes (~1.5s), then fade logo down
//     const t0 = setTimeout(() => setFadeLogo(true), 1900);

//     // Start stripe wipe 400ms after fade starts
//     const t1 = setTimeout(() => setWipeActive(true), 2300);

//     // last stripe: 2300 + 380 + 1550 = 4230ms
//     const t2 = setTimeout(() => {
//       setVisible(false);
//       onCompleteRef.current();
//     }, 4350);

//     return () => {
//       cancelAnimationFrame(raf);
//       clearTimeout(t0);
//       clearTimeout(t1);
//       clearTimeout(t2);
//     };
//   }, []);

//   if (!visible) return null;

//   // const stripes = [
//   //   { delay: 0,    duration: 0.75, origin: "0% 50%"   },
//   //   { delay: 0.12, duration: 0.95, origin: "100% 50%" },
//   //   { delay: 0.24, duration: 1.2,  origin: "0% 50%"   },
//   //   { delay: 0.38, duration: 1.3, origin: "100% 50%" },
//   // ];

// const stripes = [
//   { duration: 1.3, origin: "100% 50%"   },
//   { duration: 1.2, origin: "100% 50%" },
//   { duration: 0.95,  origin: "100% 50%"   },
//   { duration: 0.75, origin: "100% 50%" },
// ];

//   return (
//     <div style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none", overflow: "hidden" }}>

//       {/* 4 stripes = the white screen */}
//       {stripes.map((stripe, i) => (
//         <motion.div
//           key={i}
//           initial={{ scaleX: 1 }}
//           animate={{ scaleX: wipeActive ? 0 : 1 }}
//           transition={{
//             duration: stripe.duration,
//             // delay: wipeActive ? stripe.delay : 0,
//             delay: 0,
//             ease: [0.76, 0, 0.24, 1],
//           }}
//           style={{
//             position: "absolute", left: 0, width: "100%",
//             top: `${i * 25}%`, height: "25%",
//             background: "#ffffff",
//             transformOrigin: stripe.origin,
//             zIndex: 1,
//           }}
//         />
//       ))}

//       {/* Centering wrapper — plain div, no framer motion, so centering is never disturbed */}
//       <div
//         style={{
//           position: "absolute",
//           top: "50%", left: "50%",
//           transform: "translate(-50%, -50%)",
//           zIndex: 2,
//         }}
//       >
//         {/* Logo fade+drop wrapper — motion only, no centering transforms here */}
//         <motion.div
//           animate={fadeLogo ? { opacity: 0, y: 14 } : { opacity: 1, y: 0 }}
//           transition={{ duration: 0.45, ease: [0.4, 0, 1, 1] }}
//           style={{ width: 260, height: 44, overflow: "hidden", position: "relative" }}
//         >
//           <Image
//             src="/assets/logos/header-logo-full.svg"
//             alt="Logo"
//             width={500}
//             height={150}
//             style={{
//               width: "auto", height: 40,
//               position: "absolute", top: "50%", left: "50%",
//               transform: "translate(-50%,-50%)",
//             }}
//           />

//           {/* LEFT cover → slides LEFT */}
//           <motion.div
//             initial={{ x: "0%" }}
//             animate={{ x: revealLogo ? "-100%" : "0%" }}
//             transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
//             style={{ position: "absolute", top: 0, left: 0, width: "50%", height: "100%", background: "#ffffff", zIndex: 3 }}
//           />

//           {/* RIGHT cover → slides RIGHT */}
//           <motion.div
//             initial={{ x: "0%" }}
//             animate={{ x: revealLogo ? "100%" : "0%" }}
//             transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
//             style={{ position: "absolute", top: 0, right: 0, width: "50%", height: "100%", background: "#ffffff", zIndex: 3 }}
//           />
//         </motion.div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface PageLoadAnimationProps {
  onComplete: () => void;
}

export default function PageLoadAnimation({
  onComplete,
}: PageLoadAnimationProps) {
  const [revealLogo, setRevealLogo] = useState(false);
  const [wipeActive, setWipeActive] = useState(false);
  const [fadeLogo, setFadeLogo] = useState(false);
  const [visible, setVisible] = useState(true);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const raf = requestAnimationFrame(() => setRevealLogo(true));
    const t0 = setTimeout(() => setFadeLogo(true), 1900);
    const t1 = setTimeout(() => setWipeActive(true), 2300);
    // last stripe: 2300 + 1300 = 3600ms
    const t2 = setTimeout(() => {
      setVisible(false);
      onCompleteRef.current();
    // }, 3620);
    }, 3550);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!visible) return null;

  const stripes = [
    { duration: 1.3, origin: "100% 50%" },
    { duration: 1.2, origin: "100% 50%" },
    { duration: 0.95, origin: "100% 50%" },
    { duration: 0.75, origin: "100% 50%" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {stripes.map((stripe, i) => (
        <motion.div
          key={i}
          initial={{ scaleX: 1 }}
          animate={{ scaleX: wipeActive ? 0 : 1 }}
          transition={{
            duration: stripe.duration,
            delay: 0,
            ease: [0.76, 0, 0.24, 1],
          }}
          style={{
            position: "absolute",
            left: 0,
            width: "100%",
            top: `${i * 25}%`,
            height: "25%",
            background: "#ffffff",
            transformOrigin: stripe.origin,
            zIndex: 1,
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
        }}
      >
        <motion.div
          animate={fadeLogo ? { opacity: 0, y: 14 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 1, 1] }}
          style={{
            width: 260,
            height: 44,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Image
            src="/assets/logos/header-logo-full.svg"
            alt="Logo"
            width={500}
            height={150}
            style={{
              width: "auto",
              height: 40,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          />
          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: revealLogo ? "-100%" : "0%" }}
            transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "50%",
              height: "100%",
              background: "#ffffff",
              zIndex: 3,
            }}
          />
          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: revealLogo ? "100%" : "0%" }}
            transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "50%",
              height: "100%",
              background: "#ffffff",
              zIndex: 3,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
