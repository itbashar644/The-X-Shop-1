
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface CatalogLayoutProps {
  children: React.ReactNode;
}

const CatalogLayout: React.FC<CatalogLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container px-4 py-8 md:px-6 flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default CatalogLayout;
