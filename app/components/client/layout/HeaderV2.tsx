// "use client";

// import Image from "next/image";
// import { IoPhoneLandscape, IoPhonePortrait, IoSearch } from "react-icons/io5";
// import { MdLocalPhone } from "react-icons/md";

// export default function Header() {
//   return (
//     <header className="w-full absolute top-50 left-0 z-999 overflow-hidden ">
//       <div className="flex items-center justify-between w-full container">
//         {/* Left - Hamburger */}
//         <div className="w-1/5 md:w-1/3 flex items-center">
//           <button className="flex items-center justify-center cursor-pointer">
//             <Image
//               src="/assets/icons/menu-ham.svg"
//               alt="Menu"
//               width={44}
//               height={32}
//               className="w-auto h-[20px] w-auto 2xl:w-[44px] 2xl:h-[30px]"
//             />
//           </button>
//         </div>

//         {/* Center - Logo */}
//         <div className="w-1/3 flex justify-center items-center cursor-pointer">
//           <Image
//             src="/assets/logos/header-logo-full.svg"
//             alt="Logo"
//             width={500}
//             height={150}
//             className="w-auto h-[40px]"
//           />
//         </div>

//         {/* Right - Contact + Search */}
//         <div className="w-1/3 flex items-center justify-end gap-[6px]">
//           {/* Contact Button */}
//           <button className="hidden md:flex bg-primary text-secondary leading-[1.7333] rounded-[50px] text-16 uppercase px-20 py-[3px] cursor-pointer">
//             Contact
//           </button>
//           <button className="flex md:hidden items-center justify-center w-8 h-8 rounded-full border border-primary cursor-pointer">
//             <MdLocalPhone className="w-auto h-[20px] text-primary" />
//           </button>
//           {/* Search Icon */}
//           <button className="flex items-center justify-center w-8 h-8 rounded-full border border-primary cursor-pointer">
//             <IoSearch className="w-auto h-[20px] text-primary" />
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }




"use client";

import Image from "next/image";
import { IoSearch } from "react-icons/io5";
import { MdLocalPhone } from "react-icons/md";
import { motion } from "framer-motion";
import { useAppShell } from "./AppShellV2";
import { useLenis } from "./LenisProvider";
import { useEffect, useRef } from "react";

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

export default function HeaderV2() {
  const { animateIn } = useAppShell();
  const { scrollTo } = useLenis();
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const isHidden = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;
      lastScrollY.current = currentY;

      const el = headerRef.current;
      if (!el) return;

      if (currentY <= 10) {
        // At the very top — always visible
        if (isHidden.current) {
          isHidden.current = false;
          el.style.transform = "translateY(0%)";
          el.style.opacity = "1";
          el.style.pointerEvents = "auto";
        }
      } else if (diff > 0) {
        // Scrolling down — hide
        if (!isHidden.current) {
          isHidden.current = true;
          el.style.transform = "translateY(-130%)";
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
        }
      } else if (diff < 0) {
        // Scrolling up — show
        if (isHidden.current) {
          isHidden.current = false;
          el.style.transform = "translateY(0%)";
          el.style.opacity = "1";
          el.style.pointerEvents = "auto";
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="pt-[20px] lg:pt-[40px] 3xl:pt-[50px]"
      ref={headerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 998,
        transform: "translateY(0%)",
        opacity: 1,
        transition: "transform 0.9s cubic-bezier(0.77,0,0.175,1), opacity 0.6s ease",
        pointerEvents: "auto",
      }}
    >
      <div className="flex items-center justify-between w-full container">

        {/* Left - Hamburger */}
        <motion.div
          className="w-1/5 md:w-1/3 flex items-center"
          initial="hidden"
          animate={animateIn ? "visible" : "hidden"}
          variants={dropDown(0.18)}
        >
          <button className="flex items-center justify-center cursor-pointer">
            <Image
              src="/assets/icons/menu-ham.svg"
              alt="Menu"
              width={44}
              height={32}
              className="w-auto h-[20px] 2xl:w-[44px] 2xl:h-[30px]"
            />
          </button>
        </motion.div>

        {/* Center - Logo */}
        <motion.div
          className="w-1/3 flex justify-center items-center cursor-pointer"
          initial="hidden"
          animate={animateIn ? "visible" : "hidden"}
          variants={dropDown(0)}
        >
          <Image
            src="/assets/logos/header-logo-full.svg"
            alt="Logo"
            width={500}
            height={150}
            className="w-auto h-[40px]"
          />
        </motion.div>

        {/* Right icons */}
        <motion.div
          className="w-1/3 flex items-center justify-end gap-[6px]"
          initial="hidden"
          animate={animateIn ? "visible" : "hidden"}
          variants={dropDown(0.18)}
        >
          <button className="hidden md:flex bg-primary text-secondary leading-[1.7333] rounded-[50px] text-16 uppercase px-20 py-[3px] cursor-pointer">
            Contact
          </button>
          <button className="flex md:hidden items-center justify-center w-8 h-8 rounded-full border border-primary cursor-pointer">
            <MdLocalPhone className="w-auto h-[20px] text-primary" />
          </button>
          <button className="flex items-center justify-center w-8 h-8 rounded-full border border-primary cursor-pointer">
            <IoSearch className="w-auto h-[20px] text-primary" />
          </button>
        </motion.div>

      </div>
    </header>
  );
}