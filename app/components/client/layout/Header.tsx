// "use client";

// import Image from "next/image";
// import { IoSearch } from "react-icons/io5";
// import { MdLocalPhone } from "react-icons/md";
// import { motion } from "framer-motion";
// import { useAppShell } from "./AppShell";
// import { useLenis } from "./LenisProvider";
// import { useEffect, useRef } from "react";
// import Link from "next/link";

// const dropDown = (delay: number) => ({
//   hidden: { y: -22, opacity: 0 },
//   visible: {
//     y: 0,
//     opacity: 1,
//     transition: {
//       delay,
//       duration: 0.7,
//       ease: [0.33, 1, 0.68, 1] as [number, number, number, number],
//     },
//   },
// });

// export default function Header() {
//   const { animateIn } = useAppShell();
//   const { scrollTo } = useLenis();
//   const headerRef = useRef<HTMLElement>(null);
//   const lastScrollY = useRef(0);
//   const isHidden = useRef(false);

//   useEffect(() => {
//     const onScroll = () => {
//       const currentY = window.scrollY;
//       const diff = currentY - lastScrollY.current;
//       lastScrollY.current = currentY;

//       const el = headerRef.current;
//       if (!el) return;

//       if (currentY <= 10) {
//         // 🔝 Top — initial state
//         el.style.background = "transparent";
//         el.style.backdropFilter = "blur(0px)";
//         el.style.paddingTop = "50px"; // ✅ UPDATED
//         el.style.paddingBottom = "50px"; // optional (keep consistent)

//         if (isHidden.current) {
//           isHidden.current = false;
//           el.style.transform = "translateY(0%)";
//           el.style.opacity = "1";
//           el.style.pointerEvents = "auto";
//         }
//       } else if (diff > 0) {
//         // ⬇️ Scroll down — hide
//         if (!isHidden.current) {
//           isHidden.current = true;
//           el.style.transform = "translateY(-130%)";
//           el.style.opacity = "0";
//           el.style.pointerEvents = "none";
//         }
//       } else if (diff < 0) {
//         // ⬆️ Scroll up — show + style
//         if (isHidden.current) {
//           isHidden.current = false;
//           el.style.transform = "translateY(0%)";
//           el.style.opacity = "1";
//           el.style.pointerEvents = "auto";
//         }

//         // ✅ Black glass
//         el.style.background =
//           "linear-gradient(90deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.03) 52.69%, rgba(0, 0, 0, 0.3) 100%)";
//         el.style.backdropFilter = "blur(30px)";

//         // ✅ Reduced padding
//         el.style.paddingTop = "50px";
//         el.style.paddingBottom = "50px";
//       }
//     };

//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   return (
//     <header
//       className="pt-[20px] lg:pt-[40px] 3xl:pt-[50px] max-h-[130px]"
//       ref={headerRef}
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100%",
//         zIndex: 998,
//         transform: "translateY(0%)",
//         opacity: 1,
//         transition: "all 0.6s cubic-bezier(0.77,0,0.175,1)",
//         pointerEvents: "auto",
//       }}
//     >
//       <div className="flex items-center justify-between w-full container">
//         {/* Left - Hamburger */}
//         <motion.div
//           className="w-1/5 md:w-1/3 flex items-center"
//           initial="hidden"
//           animate={animateIn ? "visible" : "hidden"}
//           variants={dropDown(0.18)}
//         >
//           <button className="flex items-center justify-center cursor-pointer">
//             <Image
//               src="/assets/icons/menu-ham.svg"
//               alt="Menu"
//               width={44}
//               height={32}
//               className="w-auto h-[20px] 2xl:w-[44px] 2xl:h-[30px]"
//             />
//           </button>
//         </motion.div>

//         {/* Center - Logo */}
//           <motion.div
//             className="w-1/3 flex justify-center items-center cursor-pointer"
//             initial="hidden"
//             animate={animateIn ? "visible" : "hidden"}
//             variants={dropDown(0)}
//           >
//         <Link href="/">
//             <Image
//               src="/assets/logos/header-logo-full.svg"
//               alt="Logo"
//               width={500}
//               height={150}
//               className="w-auto h-[40px]"
//               />
//               </Link>
//           </motion.div>

//         {/* Right icons */}
//         <motion.div
//           className="w-1/3 flex items-center justify-end gap-[6px]"
//           initial="hidden"
//           animate={animateIn ? "visible" : "hidden"}
//           variants={dropDown(0.18)}
//         >
//           <button className="hidden md:flex bg-primary text-secondary leading-[1.7333] rounded-[50px] text-15 uppercase px-20 py-[3px] cursor-pointer 3xl:w-[109px] 3xl:h-[32px]">
//             Contact
//           </button>
//           <button className="flex md:hidden items-center justify-center w-8 h-8 rounded-full border border-primary cursor-pointer">
//             <MdLocalPhone className="w-auto h-[20px] text-primary" />
//           </button>
//           <button className="flex items-center justify-center w-8 h-8 rounded-full border border-primary cursor-pointer">
//             <IoSearch className="w-auto h-[20px] text-primary" />
//           </button>
//         </motion.div>
//       </div>
//     </header>
//   );
// }


"use client";

import { IoSearch } from "react-icons/io5";
import { MdLocalPhone } from "react-icons/md";
import { motion } from "framer-motion";
import { useAppShell } from "./AppShell";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NavDropdown, NavDropdownHandle } from "./NavDropdown";
import Image from "next/image";
import MenuIcon from "./HamburgerAniamtion";

// ─── Header entry animation ───────────────────────────────────────────────────
const dropDown = (delay: number) => ({
  hidden: { y: -22, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      delay,
      duration: 0.7,
      ease: [0.33, 1, 0.68, 1] as [number, number, number, number],
    },
  },
});

export default function Header() {
  const { animateIn } = useAppShell();

  const headerRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const isHidden = useRef(false);
  const dropdownRef = useRef<NavDropdownHandle>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuOpenRef = useRef(false);

    useEffect(() => {
    menuOpenRef.current = menuOpen;
 
    // when dropdown opens, immediately clear glass style and ensure header is visible
    const el = headerRef.current;
    if (!el) return;
    if (menuOpen) {
      el.style.background = "transparent";
      el.style.backdropFilter = "blur(0px)";
      // make sure header is visible if it was hidden
      if (isHidden.current) {
        isHidden.current = false;
        el.style.transform = "translateY(0%)";
        el.style.opacity = "1";
        el.style.pointerEvents = "auto";
      }
    }
  }, [menuOpen]);

  // ── Scroll-based header show/hide + glass style (original behaviour) ──────
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;
      lastScrollY.current = currentY;

      const el = headerRef.current;
      if (!el) return;

      if (currentY <= 10) {
        el.style.background = "transparent";
        el.style.backdropFilter = "blur(0px)";
        el.style.paddingTop = "50px";
        el.style.paddingBottom = "50px";
        if (isHidden.current) {
          isHidden.current = false;
          el.style.transform = "translateY(0%)";
          el.style.opacity = "1";
          el.style.pointerEvents = "auto";
        }
      } else if (diff > 0) {
        if (!menuOpenRef.current && !isHidden.current) {
          isHidden.current = true;
          el.style.transform = "translateY(-130%)";
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
        }
      } else {
        if (isHidden.current) {
          isHidden.current = false;
          el.style.transform = "translateY(0%)";
          el.style.opacity = "1";
          el.style.pointerEvents = "auto";
        }
        if (!menuOpenRef.current) {
          el.style.background =
            "linear-gradient(90deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.03) 52.69%, rgba(0,0,0,0.3) 100%)";
          el.style.backdropFilter = "blur(30px)";
        }
        el.style.paddingTop = "50px";
        el.style.paddingBottom = "50px";
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleToggle = () => {
    dropdownRef.current?.toggle();
    setMenuOpen((prev) => !prev);
  };

  return (
    <>
      {/* ── Fixed header bar — z-index sits above the dropdown (1000 > 999) ── */}
      <header
        ref={headerRef}
        className="pt-[20px] lg:pt-[40px] 3xl:pt-[50px] max-h-[130px]"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          transform: "translateY(0%)",
          opacity: 1,
          transition: "all 0.6s cubic-bezier(0.77,0,0.175,1)",
          pointerEvents: "auto",
        }}
      >
        <div className="flex items-center justify-between w-full container">
          {/* ── Left — Hamburger / Close ───────────────────────────────────── */}
          <motion.div
            className="w-1/5 md:w-1/3 flex items-center"
            initial="hidden"
            animate={animateIn ? "visible" : "hidden"}
            variants={dropDown(0.18)}
          >
            <button
              onClick={handleToggle}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex items-center justify-center cursor-pointer"
            >
              <MenuIcon open={menuOpen} />
            </button>
          </motion.div>

          {/* ── Centre — Logo ──────────────────────────────────────────────── */}
          <motion.div
            className="w-1/3 flex justify-center items-center cursor-pointer"
            initial="hidden"
            animate={animateIn ? "visible" : "hidden"}
            variants={dropDown(0)}
          >
            <Link href="/">
              <Image
                src="/assets/logos/header-logo-full.svg"
                alt="Logo"
                width={500}
                height={150}
                className="w-auto h-[40px]"
              />
            </Link>
          </motion.div>

          {/* ── Right — Contact + Search ───────────────────────────────────── */}
          <motion.div
            className="w-1/3 flex items-center justify-end gap-[6px]"
            initial="hidden"
            animate={animateIn ? "visible" : "hidden"}
            variants={dropDown(0.18)}
          >
            <Link href="/contact-us">
              <button className="hidden md:flex bg-primary text-secondary leading-[1.7333] rounded-[50px] text-15 uppercase px-20 py-[3px] cursor-pointer 3xl:w-[109px] 3xl:h-[32px]">
                Contact
              </button>
            </Link>
            <button className="flex md:hidden items-center justify-center w-8 h-8 rounded-full border border-primary cursor-pointer">
              <MdLocalPhone className="w-auto h-[20px] text-primary" />
            </button>
            <button
              className={`flex items-center justify-center w-8 h-8 rounded-full border ${menuOpen ? "border-secondary" : "border-primary"} cursor-pointer transition-all duration-500 ease-in-out`}
            >
              <IoSearch
                className={`w-auto h-[20px] ${menuOpen ? "text-secondary" : "text-primary"} transition-all duration-500 ease-in-out`}
              />
            </button>
          </motion.div>
        </div>
      </header>

      {/* Dropdown Menu */}
      <NavDropdown ref={dropdownRef} />
    </>
  );
}
