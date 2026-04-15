import HeroSection from './sections/HeroSection'
import WellnessSlider from './sections/WellnessSlider'
import { wellnessSliderData, wellnessSliderData2, longevitySystemsData, whyNeuroVantaData } from './data'
import LongevitySystems from './sections/LongevitySystems'
import HeroStats from './sections/StatsRow'
import WhyNeuroVanta from './sections/WhyNeuroVanta'
import ElevatingWellness from './sections/ElevatingWellness'
import WorldClassClients from './sections/WorldClassClients'
import BeginHerePage from './sections/BeginHere'

const Index = () => {
  return (
    <>
    <HeroSection />
    <WellnessSlider data={wellnessSliderData}  />
    <WellnessSlider data={wellnessSliderData2} descriptionMaxWidth='max-w-[65ch]' />
    <LongevitySystems data={longevitySystemsData} />
    <HeroStats />
    <WhyNeuroVanta data={whyNeuroVantaData} />
    <ElevatingWellness />
    <WorldClassClients />
    <BeginHerePage />
    </>
  )
}

export default Index