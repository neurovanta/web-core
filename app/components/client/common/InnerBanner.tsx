import Image from "next/image";
import Breadcrumb from "./BreadCrumb";

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
  return (
    <section className="relative w-full xl:min-h-[570px] 3xl:h-[639px]">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={image}
          alt="banner-image"
          fill
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="absolute bottom-20 left-0 right-0 z-10 flex flex-col items-center gap-50">
        <div className={maxWTitle}>
          <h1 className="text-white text-center text-banner whitespace-pre-line">
            {title}
          </h1>
        </div>

        <Breadcrumb />
      </div>
    </section>
  );
}
