
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import ProductsSection from "@/components/home/ProductsSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import { useHomeData } from "@/hooks/useHomeData";

const Index = () => {
  const { bestsellers, newProducts, categories, categoryObjects, loading } = useHomeData();

  useEffect(() => {
    document.title = "The X Shop | Товары из Китая для вашего дома";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead
        title="Главная"
        description="The X Shop: Товары из Китая для вашего дома. Минималистичный дизайн, высокое качество, доступные цены."
        keywords="товары из китая, дизайнерские товары, товары для дома, минимализм"
      />
      
      <Navbar />

      <main className="flex-grow" itemScope itemType="https://schema.org/WebPage">
        <HeroSection categories={categories} />
        <CategoriesSection categoryObjects={categoryObjects} loading={loading} />
        <ProductsSection 
          title="Бестселлеры" 
          products={bestsellers} 
          loading={loading} 
          className="bg-gray-50"
        />
        <ProductsSection 
          title="Новинки" 
          products={newProducts} 
          loading={loading}
        />
        <BenefitsSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
