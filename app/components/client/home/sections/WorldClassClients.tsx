import Image from "next/image";
import { brandsData } from "../data";

type Brand = {
  id: string;
  logo: string;
};

function BrandCard({ brand }: { brand: Brand }) {

  return (
    <div
      className="
        flex items-center justify-center border border-border-color
        w-[200px] h-[136px]
        lg:w-[300px] lg:h-[205px]
        xl:w-[270px] xl:h-[185px]
        2xl:w-[280px] 2xl:h-[190px]
        3xl:w-[366px] 3xl:h-[250px]
        flex-shrink-0
      "
    >
      <Image
        src={brand.logo}
        alt={brand.id}
        width={220}
        height={91}
        className="object-contain h-[80px] 3xl:h-[91px] w-auto"
      />
    </div>
  );
}

export default function WorldClassClients() {
  const { heading, rows } = brandsData;

  return (
    <section className="container pt-90 3xl:pt-[94px] pb-120 3xl:pb-150">
      <div className="mb-50">
        <h2 className="text-heading text-secondary max-w-[21ch]">{heading}</h2>
      </div>

      <div className="flex flex-col gap-5 3xl:mt-[5px]">
        {/* Row 1 — three cards at right end */}
        <div className="flex w-full justify-end gap-20">
          {rows.row1.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>

        {/* Row 2 — three cards at left end */}
        <div className="flex w-full justify-start gap-20">
          {rows.row2.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>

        {/* Row 3 — one card left, two cards right */}
        <div className="flex w-full justify-between">
          <BrandCard brand={rows.row3.left} />
          <div className="flex gap-20">
            {rows.row3.right.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}