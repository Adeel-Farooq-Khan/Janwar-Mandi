import HeroSection from "../components/hero-section";
import CategoriesSection from "../components/categories-section";
import ListingsGrid from "../components/listings-grid";
import FeaturedBanner from "../components/featured-banner";
import AppDownload from "../components/app-download";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <ListingsGrid />
      <FeaturedBanner />
      <AppDownload />
    </>
  );
}
