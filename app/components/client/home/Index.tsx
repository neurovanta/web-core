import HeroSection from "./sections/HeroSection";
import WellnessSlider from "./sections/WellnessSlider";
import TabsWithSlider from "../common/TabsWithSlider";
import HeroStats from "./sections/StatsRow";
import WhyNeuroVanta from "./sections/WhyNeuroVanta";
import ElevatingWellness from "./sections/ElevatingWellness";
import WorldClassClients from "./sections/WorldClassClients";
import BeginHerePage from "./sections/BeginHere";
import { HomePageData } from "@/app/types/home";

const Index = ({ data }: { data: HomePageData }) => {
  return (
    <>
      <div style={{ position: "relative" }}>
        {/* Section 1 — Hero */}
        <div
          style={{ position: "sticky", top: 0, height: "100svh", zIndex: 1 }}
        >
          <HeroSection data={data.home.firstSection} />
        </div>

        {/* Section 2 — Wellness Slider 1 */}
        <div
          style={{ position: "sticky", top: 0, height: "100svh", zIndex: 2 }}
        >
          <WellnessSlider data={data.home.secondSection} />
        </div>

        {/* Section 3 — Wellness Slider 2 */}
        <div
          style={{ position: "sticky", top: 0, height: "100svh", zIndex: 3 }}
        >
          <WellnessSlider
            data={data.home.thirdSection}
            descriptionMaxWidth="max-w-[60ch] 2xl:max-w-[65ch]"
          />
        </div>
      </div>
      <TabsWithSlider
        data={{
          heading: data.home.fourthSection.title,
          categories: data.categories.map((cat) => ({
            label: cat.title,
            slides: cat.products.map((p) => ({
              image: p.thumbnailImage ?? "",
              imageAlt: p.thumbnailImageAlt,
              title: p.thumbnailTitle,
              href: `/longevity-systems/${p.slug ?? ""}`,
            })),
          })),
        }}
        className="bg-white py-[65px] lg:py-120 3xl:py-150"
      />
      <HeroStats data={data.home.fifthSection} />
      <WhyNeuroVanta data={data.home.sixthSection} />
      <ElevatingWellness
        data={data.home.seventhSection}
        industries={data.industries}
      />
      <WorldClassClients data={data.home.eighthSection} />
      <BeginHerePage data={data.home.ninthSection} />
    </>
  );
};

export default Index;
