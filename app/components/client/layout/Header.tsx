"use client";

import Image from "next/image";
import { IoPhoneLandscape, IoPhonePortrait, IoSearch } from "react-icons/io5";
import { MdLocalPhone } from "react-icons/md";

export default function Header() {
  return (
    <header className="w-full absolute top-50 left-0 z-999 overflow-hidden ">
      <div className="flex items-center justify-between w-full container">
        {/* Left - Hamburger */}
        <div className="w-1/5 md:w-1/3 flex items-center">
          <button className="flex items-center justify-center cursor-pointer">
            <Image
              src="/assets/icons/menu-ham.svg"
              alt="Menu"
              width={44}
              height={32}
              className="w-auto h-[20px] w-auto 2xl:w-[44px] 2xl:h-[30px]"
            />
          </button>
        </div>

        {/* Center - Logo */}
        <div className="w-1/3 flex justify-center items-center cursor-pointer">
          <Image
            src="/assets/logos/header-logo-full.svg"
            alt="Logo"
            width={500}
            height={150}
            className="w-auto h-[40px]"
          />
        </div>

        {/* Right - Contact + Search */}
        <div className="w-1/3 flex items-center justify-end gap-[6px]">
          {/* Contact Button */}
          <button className="hidden md:flex bg-primary text-secondary leading-[1.7333] rounded-[50px] text-16 uppercase px-20 py-[3px] cursor-pointer">
            Contact
          </button>
          <button className="flex md:hidden items-center justify-center w-8 h-8 rounded-full border border-primary cursor-pointer">
            <MdLocalPhone className="w-auto h-[20px] text-primary" />
          </button>
          {/* Search Icon */}
          <button className="flex items-center justify-center w-8 h-8 rounded-full border border-primary cursor-pointer">
            <IoSearch className="w-auto h-[20px] text-primary" />
          </button>
        </div>
      </div>
    </header>
  );
}
