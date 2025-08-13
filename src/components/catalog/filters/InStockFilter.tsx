
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { PackageCheck } from "lucide-react";

interface InStockFilterProps {
  inStockOnly: boolean;
  inStockCount: number;
  handleInStockFilter: (checked: boolean) => void;
  loading: boolean;
}

const InStockFilter: React.FC<InStockFilterProps> = ({
  inStockOnly,
  handleInStockFilter,
  loading
}) => {
  return (
    <div className="border-t pt-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <PackageCheck className="h-4 w-4" />
        Наличие
      </h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="in-stock" 
            checked={inStockOnly} 
            onCheckedChange={(checked) => handleInStockFilter(checked === true)}
            disabled={loading}
          />
          <label
            htmlFor="in-stock"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Только в наличии
          </label>
        </div>
      </div>
    </div>
  );
};

export default InStockFilter;
