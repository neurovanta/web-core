import Image from "next/image";

type Brand = {
  _id: string;
  image: string;
  imageAlt: string;
};

export function BrandCard({ brand }: { brand: Brand }) {
  return (
    <div data-brand-card
      className="brand-card flex items-center justify-center border border-border-color 
        w-[156px] h-[107px]
        sm:w-[200px] sm:h-[160px]
        lg:w-[270px] lg:h-[185px]
        2xl:w-[280px] 2xl:h-[190px]
        3xl:w-[366px] 3xl:h-[250px]
        flex-shrink-0 sm:flex-shrink lg:flex-shrink-0
      "
    >
      <Image
        src={brand.image}
        alt={brand.imageAlt}
        width={220}
        height={91}
        className="object-contain h-[35px] sm:h-[50px] lg:h-[65px] xl:h-[80px] 3xl:h-[91px] w-auto pointer-events-none"
      />
    </div>
  );
}