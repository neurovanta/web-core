import Image from "next/image";
import Link from "next/link";
import { footerMenus, socialLinks, SocialType } from "./data";

/* ─── Social brand styles ─────────────────────────────────────────── */
const socialStyles: Record<SocialType, React.CSSProperties> = {
  facebook: { color: "#416FF0" },
  instagram: {}, // handled separately with gradient
  linkedin: { color: "#2671AD" },
  youtube: { color: "#D92935" },
};

const instagramGradient: React.CSSProperties = {
  background:
    "linear-gradient(90deg, #4C66C7 0%, #F04D5A 35.1%, #FAD85C 66.83%, #C92AAA 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

/* ─── Helpers ─────────────────────────────────────────────────────── */

/** Splits items: first 4 in col-1, anything beyond col-2 */
function splitItems<T>(items: T[]): [T[], T[]] {
  if (items.length <= 4) return [items, []];
  return [items.slice(0, 4), items.slice(4)];
}

/* ─── Component ───────────────────────────────────────────────────── */
export default function Footer() {
  return (
    <footer className="bg-white">
      {/* ── Main content container ── */}
      <div className="container">

        {/* Logo */}
        <div className="w-full xl:h-[218px] pt-20">
          <Image
            src="/assets/logos/footer-logo.svg" 
            alt="Neuro Vanta"
            width={2000}
            height={300}
            className="w-full xl:h-[218px]"
          />
        </div>

        {/* ── Top section: address + contact ── */}
        <div className="flex flex-wrap mt-60 md:mt-130 gap-y-20 3xl:mt-[136px]">

          {/* Left – address */}
          <div className="sm:w-[51%] 3xl:pt-[16px]">
              <p className="text-secondary text-19 leading-[1.42] whitespace-pre-line">
                {`Neuro Vanta\nP.O.Box 13653, 901 – SIT Tower\nDubai Silicon Oasis\nDubai, UAE`}
              </p>
          </div>

          {/* Right – email, phone, then gap, then socials */}
          <div className="sm:w-[49%]">
            <div className="text-secondary text-30 lg:text-60 flex flex-col">
              <Link
                href="mailto:Info@neurovanta.com"
                className="hover:opacity-80 transition-opacity duration-300"
              >
                Info@neurovanta.com
              </Link>
              <Link
                href="tel:+97145821133"
                className="hover:opacity-80 transition-opacity duration-300 -mt-[6px]"
              >
                +971 4 582 1133
              </Link>
            </div>

            {/* Gap before socials */}
            <div className="mb-20 sm:mb-50" />

            {/* Social links */}
            <div className="flex flex-wrap gap-x-30 gap-y-[5px]">
              {socialLinks.map(({ label, href, type }) => (
                <Link
                  key={type}
                  href={href}
                  className="text-19 leading-[1.42] tracking-[-0.03em]"
                  style={
                    type === "instagram"
                      ? instagramGradient
                      : socialStyles[type]
                  }
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-border-color mt-20 mb-20 sm:mt-120 sm:mb-100" />

        {/* ── Menus ── */}
        <div className="flex flex-wrap gap-y-20 gap-x-50 3xl:gap-x-[150px]">

          {footerMenus.map((menu) => {
            const [col1, col2] = splitItems(menu.items);
            const isWide = col2.length > 0;

            return (
              <div
                key={menu.heading}
              >
                {/* Heading */}
                <h3 className="text-secondary text-subHeading mb-2.5 md:mb-40">
                  {menu.heading}
                </h3>

                {/* Items: single or double column */}
                <div className={isWide ? "flex flex-row gap-50" : ""}>
                  {/* Column 1 (always present) */}
                  <ul className="flex flex-col">
                    {col1.map(({ label, href }) => (
                      <li key={label}>
                        <Link
                          href={href}
                          className="text-secondary text-19 leading-[1.789] hover:opacity-70 transition-opacity"
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {/* Column 2 (only when items > 4) */}
                  {col2.length > 0 && (
                    <ul className="flex flex-col">
                      {col2.map(({ label, href }) => (
                        <li key={label}>
                          <Link
                            href={href}
                            className="text-secondary text-19 leading-[1.789] hover:opacity-70 transition-opacity"
                          >
                            {label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom padding before copyright bar */}
        <div className="pb-80 3xl:pb-[84px]" />
      </div>

      {/* ── Copyright bar ── */}
      <div
        className="w-full py-[10px] bg-[#FFF8F0]"
      >
        <div className="container">
          <p className="text-secondary text-15 leading-[2.666] tracking-[-0.03em]">
            Copyright {new Date().getFullYear()}© Neuro Vanta All Rights 
          </p>
        </div>
      </div>
    </footer>
  );
}