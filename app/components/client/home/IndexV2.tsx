import HeroSectionV2 from "./sections/HeroSectionV2";
import WellnessSlider from "./sections/WellnessSlider";
import {
  wellnessSliderData,
  wellnessSliderData2,
  longevitySystemsData,
  whyNeuroVantaData,
} from "./data";
import LongevitySystems from "./sections/LongevitySystems";
import HeroStats from "./sections/StatsRow";
import WhyNeuroVanta from "./sections/WhyNeuroVanta";
import ElevatingWellness from "./sections/ElevatingWellness";
import WorldClassClients from "./sections/WorldClassClients";
import BeginHerePage from "./sections/BeginHere";

const Index = () => {
  return (
    <>
      <div style={{ position: "relative" }}>
        {/* Section 1 — Hero */}
        <div style={{ position: "sticky", top: 0, height: "100vh", zIndex: 1 }}>
          <HeroSectionV2 />
        </div>

        {/* Section 2 — Wellness Slider 1 */}
        <div style={{ position: "sticky", top: 0, height: "100vh", zIndex: 2 }}>
          <WellnessSlider data={wellnessSliderData} />
        </div>

        {/* Section 3 — Wellness Slider 2 */}
        <div style={{ position: "sticky", top: 0, height: "100vh", zIndex: 3 }}>
          <WellnessSlider
            data={wellnessSliderData2}
            descriptionMaxWidth="max-w-[65ch]"
          />
        </div>
      </div>
      <LongevitySystems data={longevitySystemsData} />
      <HeroStats />
      <WhyNeuroVanta data={whyNeuroVantaData} />
      <ElevatingWellness />
      <WorldClassClients />
      <BeginHerePage />
    </>
  );
};

export default Index;
