
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const ProductSkeleton = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container px-4 py-8 md:px-6">
        <div className="mb-6">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="border rounded-lg overflow-hidden">
              <AspectRatio ratio={3/4}>
                <div className="w-full h-full bg-gray-200 animate-pulse"></div>
              </AspectRatio>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductSkeleton;
