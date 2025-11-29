import Header from "@/components/header"
import HeroSection from "@/components/sections/hero-section"
import AppNameSection from "@/components/sections/app-name-section"
import FeaturesSection from "@/components/sections/features-section"
import { ReviewSection } from "@/components/sections/review-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-1">
        <AppNameSection />
        <HeroSection />
        <FeaturesSection />
        <ReviewSection />
      </main>
      <Footer />
    </div>
  )
}
