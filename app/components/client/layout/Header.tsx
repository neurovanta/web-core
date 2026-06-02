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
        el.style.paddingTop = "30px";
        el.style.paddingBottom = "30px";
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
           el.style.paddingTop = "30px";
        el.style.paddingBottom = "30px";
        }
       
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
        className="pt-7.5 md:pt-5 lg:pt-[40px] 3xl:pt-[50px] max-h-[130px]"
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
              <MenuIcon open={menuOpen} dark={isCareerPage} />
            </button>
          </motion.div>

          {/* ── Centre — Logo ──────────────────────────────────────────────── */}
          <motion.div
            className="w-[158px]  flex justify-center items-center cursor-pointer"
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
                className="w-auto  h-[20px]"
              />
            </Link>
          </motion.div>

          {/* ── Right — Contact + Search ───────────────────────────────────── */}
          <motion.div
            className="  flex items-center justify-between gap-[11px] w-fit"
            initial="hidden"
            animate={animateIn ? "visible" : "hidden"}
            variants={dropDown(0.18)}
          >
            <Link href="/contact-us" className="hidden md:block">
              <button className=" md:flex justify-center items-center bg-primary text-secondary text-center leading-1 rounded-[50px] text-15 uppercase px-20 py-[3px] cursor-pointer 3xl:w-[109px] h-7.5">
                Contact
              </button>
            </Link>
            <button className={`flex md:hidden items-center justify-center w-7.5 h-7.5 rounded-full border border-primary cursor-pointer
              ${
                menuOpen || (!isScrolled && isCareerPage)
                  ? "border-secondary"
                  : "border-primary"
              } cursor-pointer transition-all duration-500 ease-in-out`}>
             
<svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-all duration-500 ease-in-out ${
                menuOpen || (!isScrolled && isCareerPage)
                  ? "brightness-0 invert-0"
                  : ""
              } `}> 
<path d="M11.4263 10.298C11.4263 10.514 11.3826 10.736 11.2896 10.952C11.1965 11.168 11.0762 11.372 10.9175 11.564C10.6494 11.888 10.354 12.122 10.0202 12.272C9.69192 12.422 9.33628 12.5 8.95328 12.5C8.3952 12.5 7.79882 12.356 7.16961 12.062C6.5404 11.768 5.9112 11.372 5.28746 10.874C4.65825 10.37 4.06187 9.812 3.49284 9.194C2.92929 8.57 2.42045 7.916 1.96633 7.232C1.51768 6.548 1.15657 5.864 0.893939 5.186C0.631313 4.502 0.5 3.848 0.5 3.224C0.5 2.816 0.565657 2.426 0.69697 2.066C0.828283 1.7 1.0362 1.364 1.32618 1.064C1.67635 0.686 2.05934 0.5 2.46423 0.5C2.61742 0.5 2.77062 0.536 2.90741 0.608C3.04966 0.68 3.17551 0.788 3.27399 0.944L4.54335 2.906C4.64184 3.056 4.71296 3.194 4.76221 3.326C4.81145 3.452 4.8388 3.578 4.8388 3.692C4.8388 3.836 4.80051 3.98 4.72391 4.118C4.65278 4.256 4.54882 4.4 4.41751 4.544L4.00168 5.018C3.9415 5.084 3.91414 5.162 3.91414 5.258C3.91414 5.306 3.91961 5.348 3.93056 5.396C3.94697 5.444 3.96338 5.48 3.97433 5.516C4.07281 5.714 4.24242 5.972 4.48316 6.284C4.72938 6.596 4.992 6.914 5.27651 7.232C5.57197 7.55 5.85648 7.844 6.14646 8.114C6.43098 8.378 6.66625 8.558 6.85227 8.666C6.87963 8.678 6.91246 8.696 6.95076 8.714C6.99453 8.732 7.0383 8.738 7.08754 8.738C7.18056 8.738 7.25168 8.702 7.31187 8.636L7.72769 8.186C7.86448 8.036 7.99579 7.922 8.12163 7.85C8.24747 7.766 8.37332 7.724 8.5101 7.724C8.61406 7.724 8.72348 7.748 8.84386 7.802C8.96423 7.856 9.09007 7.934 9.22685 8.036L11.0379 9.446C11.1801 9.554 11.2786 9.68 11.3388 9.83C11.3935 9.98 11.4263 10.13 11.4263 10.298Z" stroke="#E2D3C3" stroke-miterlimit="10"/>
</svg>

            </button>
            <button
              className={`flex items-center justify-center w-7.5 h-7.5 rounded-full border ${
                menuOpen || (!isScrolled && isCareerPage)
                  ? "border-secondary"
                  : "border-primary"
              } cursor-pointer transition-all duration-500 ease-in-out`}
            >
              
<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-all duration-500 ease-in-out ${
                menuOpen || (!isScrolled && isCareerPage)
                  ? "brightness-0 invert-0"
                  : ""
              } `}>
<path d="M5.54756 10.5358C8.33525 10.5358 10.5951 8.28919 10.5951 5.51789C10.5951 2.74659 8.33525 0.5 5.54756 0.5C2.75987 0.5 0.5 2.74659 0.5 5.51789C0.5 8.28919 2.75987 10.5358 5.54756 10.5358Z" stroke="#E2D3C3" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.86792 9.29631L12.0906 12.5" stroke="#E2D3C3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

            </button>
          </motion.div>
        </div>
      </header>

      {/* Dropdown Menu */}
      <NavDropdown ref={dropdownRef} onOpenChange={setMenuOpen} />
    </>
  );
}
