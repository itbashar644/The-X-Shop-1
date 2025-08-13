
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  categories: string[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ categories }) => {
  return (
    <section className="bg-gray-100 py-16">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 items-center">
          <div className="space-y-4" itemProp="mainContentOfPage">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
              The X Shop:<br />Товары из Китая для вашего дома
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Минималистичный дизайн, высокое качество, доступные цены.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link to="/catalog">Смотреть каталог</Link>
              </Button>
              {categories.length > 0 && (
                <Button variant="outline" size="lg" asChild>
                  <Link to={`/catalog?category=${categories[0]}`}>
                    {categories[0]}
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <div className="rounded-lg overflow-hidden">
            <img
              alt="Современные технологические товары"
              className="aspect-square object-cover w-full max-w-md mx-auto"
              src="/lovable-uploads/5e17e20e-4457-4c61-be22-2d405cd6a88e.png"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
