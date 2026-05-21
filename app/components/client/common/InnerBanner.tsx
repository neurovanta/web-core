"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import Breadcrumb from "./BreadCrumb";
import { AnimatedHeading } from "../animations/AnimateHeading";

export default function InnerBanner({
  image,
  title,
  maxWTitle = "",
  breadcrumbs = [],
}: {
  image: string;
  title: string;
  maxWTitle?: string;
  breadcrumbs?: any[];
}) {
  const imageRef = useRef<HTMLDivElement>(null);
  const breadcrumbRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded || !imageRef.current || !breadcrumbRef.current) return;

    const img = imageRef.current;
    const crumb = breadcrumbRef.current;

    // Set initial states
    gsap.set(img, { scale: 1.5 });
    gsap.set(crumb, { y: 18, opacity: 0 });

    const tl = gsap.timeline();

    // Zoom out from 1.5 to 1
    tl.to(img, {
      scale: 1,
      duration: 1.4,
      ease: "power3.out",
    });

    // Breadcrumb comes up during the zoom-out
    tl.to(crumb, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      ease: "power2.out",
    }, "-=0.9");

    // After zoom-out completes, begin infinite slow breathe
    tl.to(img, {
      scale: 1.08,
      duration: 6,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

  }, [loaded]);

  return (
    <section className="relative w-full xl:min-h-[540px] 3xl:h-[639px] overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <div ref={imageRef} className="absolute inset-0 w-full h-full">
          <Image
            src={image}
            alt="banner-image"
            fill
            priority
            className="w-full h-full object-cover object-center pointer-events-none"
            onLoad={() => setLoaded(true)}
          />
        </div>
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="absolute bottom-20 left-0 right-0 z-10 flex flex-col items-center gap-50">
        <div className={maxWTitle}>
          <AnimatedHeading
            title={title}
            className="text-white text-center text-60 3xl:text-70 leading-[1.142] whitespace-pre-line"
            mode="blade"
          />
        </div>

        <div ref={breadcrumbRef}>
          <Breadcrumb />
        </div>
      </div>
    </section>
  );
}