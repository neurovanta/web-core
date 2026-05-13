"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

type CircleAnimationProps = {
  variant?: 1 | 2;
};

const CircleAnimation = ({ variant = 1 }: CircleAnimationProps) => {
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const tween = gsap.fromTo(
      imgRef.current,
      { scale: 0.9 },
      {
        scale: 1.1,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      }
    );

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div ref={imgRef}>
        <Image
          src="/assets/icons/circles-animated.svg"
          alt="circle-animation"
          width={925}
          height={925}
          className={variant === 2 ? "invert brightness-0" : ""}
        />
      </div>
    </div>
  );
};

export default CircleAnimation;