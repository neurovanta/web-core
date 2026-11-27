import { isShown } from "@/app/components/client/common/isShown";
import HeroSection from "./sections/HeroSection";
import WellnessSlider from "./sections/WellnessSlider";
import TabsWithSlider from "../common/TabsWithSlider";
import HeroStats from "./sections/StatsRow";
import WhyNeuroVanta from "./sections/WhyNeuroVanta";
import ElevatingWellness from "./sections/ElevatingWellness";
import WorldClassClients from "./sections/WorldClassClients";
import BeginHerePage from "./sections/BeginHere";
import { HomePageData } from "@/app/types/home";

// Extra scroll distance Section 2 stays pinned before Section 3 covers it.
const SECTION_HOLD = "50svh";

const Index = ({ data }: { data: HomePageData }) => {
  const home = data.home;
  const visibleCategories = data.categories.filter((cat) => !cat.isHidden);

  return (
    <>
      <div style={{ position: "relative" }}>
        {/* Section 1 — Hero */}
        {isShown(home.firstSection) && (
          <div
            style={{ position: "sticky", top: 0, height: "100svh", zIndex: 1 }}
          >
            <HeroSection data={home.firstSection} />
          </div>
        )}

        {/* Section 2 — Wellness Slider 1 */}
        {isShown(home.secondSection) && (
          <div
            style={{ position: "sticky", top: 0, height: "100svh", zIndex: 2 }}
          >
            <WellnessSlider data={home.secondSection} />
          </div>
        )}

        {/* Hold: Section 2 stays pinned (fully visible) for an extra half screen of scrolling before
            Section 3 slides over it. Transparent and unpositioned, so it paints under the pinned
            section and never blocks clicks. */}
        {isShown(home.secondSection) && isShown(home.thirdSection) && (
          <div aria-hidden style={{ height: SECTION_HOLD }} />
        )}

        {/* Section 3 — Wellness Slider 2 */}
        {isShown(home.thirdSection) && (
          <div
            style={{ position: "sticky", top: 0, height: "100svh", zIndex: 3 }}
          >
            <WellnessSlider
              data={home.thirdSection}
              descriptionMaxWidth="max-w-[60ch] 2xl:max-w-[65ch]"
            />
          </div>
        )}
      </div>
      {isShown(home.fourthSection) && (
        <TabsWithSlider
          data={{
            heading: home.fourthSection.title,
            categories: visibleCategories.map((cat) => ({
              label: cat.title,
              slides: cat.products
                .filter((p) => !p.isHidden)
                .map((p) => ({
                  image: p.thumbnailImage || "/assets/placeholder.png",
                  imageAlt: p.thumbnailImageAlt,
                  title: p.thumbnailTitle,
                  href: `/longevity-systems/${p.slug ?? ""}`,
                })),
            })),
          }}
          initialIndex={Math.max(
            0,
            visibleCategories.findIndex(
              (cat) => cat._id === home.fourthSection.defaultCategory,
            ),
          )}
          className="bg-white py-16.25 lg:py-120 3xl:py-150"
        />
      )}
      {isShown(home.fifthSection) && <HeroStats data={home.fifthSection} />}
      {isShown(home.sixthSection) && <WhyNeuroVanta data={home.sixthSection} />}
      {isShown(home.seventhSection) && (
        <ElevatingWellness
          data={home.seventhSection}
          industries={data.industries}
        />
      )}
      {/* Logo marquee: shown / hidden from Admin > Home > Eighth Section (eye toggle) */}
      {isShown(home.eighthSection, true) && (
        <WorldClassClients data={home.eighthSection} />
      )}
      {isShown(home.ninthSection) && <BeginHerePage data={home.ninthSection} />}
    </>
  );
};

export default Index;
