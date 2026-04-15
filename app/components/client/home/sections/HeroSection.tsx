import Image from "next/image";
import CustomButton from "@/app/components/client/common/CustomButton";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[92vh] flex flex-col items-center justify-end pb-150">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/assets/images/home/hero/hero-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover object-center"
      >
        <source src="/assets/videos/hero-bg.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/65" />

      <div className="container relative z-10 flex flex-col items-center text-center gap-50">
        <h1 className="text-70 text-white text-center uppercase leading-[1.142] max-w-[1135px]">
          Advanced Longevity. <br /> Designed for Life Performance.
        </h1>

        <div className="flex items-center gap-20 flex-wrap justify-center">
          <CustomButton label="For Commercial" href="#" variant={1} />
          <CustomButton label="For Individual" href="#" variant={1} />
        </div>
      </div>
    </section>
  );
}