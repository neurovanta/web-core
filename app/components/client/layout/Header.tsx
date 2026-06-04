"use client";

import { IoSearch } from "react-icons/io5";
import { PiPhoneLight } from "react-icons/pi";
import { motion } from "framer-motion";
import { useAppShell } from "./AppShell";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NavDropdown, NavDropdownHandle } from "./NavDropdown";
import Image from "next/image";
import MenuIcon from "./HamburgerAniamtion";
import { usePathname } from "next/navigation";

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
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const isCareerPage = pathname.startsWith("/careers/");

  const getHeaderPadding = () => {
    return window.innerWidth < 1024 ? "30px" : "50px";
  };

  useEffect(() => {
    menuOpenRef.current = menuOpen;

    const el = headerRef.current;
    if (!el) return;
    if (menuOpen) {
      el.style.background = "transparent";
      el.style.backdropFilter = "blur(0px)";
      if (isHidden.current) {
        isHidden.current = false;
        el.style.transform = "translateY(0%)";
        el.style.opacity = "1";
        el.style.pointerEvents = "auto";
      }
    } else {
      setTimeout(() => {
        if (window.scrollY > 10) {
          el.style.background =
            "linear-gradient(90deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.03) 52.69%, rgba(0,0,0,0.3) 100%)";
          el.style.backdropFilter = "blur(30px)";
        }
      }, 400); // adjust delay to match your close animation duration
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
        setIsScrolled(false);
        el.style.background = "transparent";
        el.style.backdropFilter = "blur(0px)";
        const padding = getHeaderPadding();
        el.style.paddingTop = padding;
        el.style.paddingBottom = padding;
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
        setIsScrolled(true);
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
        const padding = getHeaderPadding();
        el.style.paddingTop = padding;
        el.style.paddingBottom = padding;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleToggle = () => {
    dropdownRef.current?.toggle();
  };

  return (
    <>
      {/* ── Fixed header bar — z-index sits above the dropdown (1000 > 999) ── */}
      <header
        ref={headerRef}
        className="pt-[30px] lg:pt-[50px] max-h-[130px]"
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
            className="w-[25%] flex items-center"
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
              <MenuIcon open={menuOpen} dark={isCareerPage} />
            </button>
          </motion.div>

          {/* ── Centre — Logo ──────────────────────────────────────────────── */}
          <motion.div
            className="w-[50%] flex justify-center items-center cursor-pointer"
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
                className="max-w-[158px] sm:max-w-[200px] md:max-w-[220px] lg:max-w-none h-[20px] sm:h-[40px]"
              />
            </Link>
          </motion.div>

          {/* ── Right — Contact + Search ───────────────────────────────────── */}
          <motion.div
            className="w-[25%] flex items-center justify-end gap-[11px] md:gap-[6px]"
            initial="hidden"
            animate={animateIn ? "visible" : "hidden"}
            variants={dropDown(0.18)}
          >
            <Link href="/contact-us">
              <button className="hidden md:flex justify-center items-center bg-primary text-secondary text-center leading-1 rounded-[50px] text-15 uppercase px-20 py-[3px] cursor-pointer 3xl:w-[109px] h-[30px] sm:h-8">
                Contact
              </button>
            </Link>
            <button
              className={`flex md:hidden items-center justify-center w-[30px] h-[30px] sm:w-8 sm:h-8 rounded-full border ${
                menuOpen || (!isScrolled && isCareerPage)
                  ? "border-secondary"
                  : "border-primary"
              } cursor-pointer transition-all duration-500 ease-in-out`}
            >
              <PiPhoneLight strokeWidth={6}
                className={`w-auto h-[15px] sm:h-[20px] ${
                  menuOpen || (!isScrolled && isCareerPage)
                    ? "text-secondary"
                    : "text-primary"
                } transition-all duration-500 ease-in-out`}
              />
            </button>
            <button
              className={`flex items-center justify-center w-[30px] h-[30px] sm:w-8 sm:h-8 rounded-full border ${
                menuOpen || (!isScrolled && isCareerPage)
                  ? "border-secondary"
                  : "border-primary"
              } cursor-pointer transition-all duration-500 ease-in-out`}
            >
              <IoSearch
                className={`w-auto h-[15px] sm:h-[20px] ${
                  menuOpen || (!isScrolled && isCareerPage)
                    ? "text-secondary"
                    : "text-primary"
                } transition-all duration-500 ease-in-out`}
              />
            </button>
          </motion.div>
        </div>
      </header>

      {/* Dropdown Menu */}
      <NavDropdown ref={dropdownRef} onOpenChange={setMenuOpen} />
    </>
  );
}
