
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DeliveryMethod } from "@/types/product";
import { Truck, Package, MapPin, Mail } from "lucide-react";

interface DeliveryMethodSelectorProps {
  deliveryMethod: DeliveryMethod | null;
  deliveryMethods: DeliveryMethod[];
  onSelectDelivery: (method: DeliveryMethod) => void;
}

const DeliveryMethodSelector = ({ 
  deliveryMethod, 
  deliveryMethods, 
  onSelectDelivery 
}: DeliveryMethodSelectorProps) => {
  
  const getDeliveryIcon = (iconName: string) => {
    switch (iconName) {
      case 'truck': return <Truck className="h-5 w-5" />;
      case 'package': return <Package className="h-5 w-5" />;
      case 'map-pin': return <MapPin className="h-5 w-5" />;
      case 'mail': return <Mail className="h-5 w-5" />;
      default: return null;
    }
  };
  
  // Ensure we have delivery methods to display
  if (!deliveryMethods || deliveryMethods.length === 0) {
    console.error("No delivery methods available");
    return null;
  }
  
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Выберите способ доставки</h2>
      <RadioGroup 
        value={deliveryMethod?.id || ""} 
        className="space-y-3"
        onValueChange={(value) => {
          const selected = deliveryMethods.find(method => method.id === value);
          if (selected) {
            onSelectDelivery(selected);
          }
        }}
      >
        {deliveryMethods.map((method) => (
          <div 
            key={method.id}
            className={`flex items-center border rounded-lg p-4 cursor-pointer ${
              deliveryMethod?.id === method.id 
                ? "border-primary bg-primary/5" 
                : "hover:bg-muted/50"
            }`}
            onClick={() => onSelectDelivery(method)}
          >
            <RadioGroupItem 
              value={method.id} 
              id={`delivery-${method.id}`} 
              className="mr-4" 
            />
            <div className="flex flex-1 items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                {getDeliveryIcon(method.icon)}
              </div>
              <div className="flex-1">
                <Label 
                  htmlFor={`delivery-${method.id}`}
                  className="font-medium cursor-pointer"
                >
                  {method.name}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {method.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

export default DeliveryMethodSelector;
