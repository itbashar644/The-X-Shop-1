
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Truck } from "lucide-react";

interface OrderTrackingProps {
  trackingNumber?: string;
  trackingUrl?: string;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ trackingNumber, trackingUrl }) => {
  if (!trackingNumber) return null;
  
  return (
    <div className="pt-2">
      <h4 className="font-semibold mb-2">Отслеживание</h4>
      {trackingUrl ? (
        <Button variant="outline" onClick={() => window.open(trackingUrl, '_blank')}>
          <Truck className="mr-2 h-4 w-4" /> 
          Трек-номер: {trackingNumber}
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <p className="text-muted-foreground">
          <Truck className="inline-block mr-2 h-4 w-4" />
          Трек-номер: {trackingNumber}
        </p>
      )}
    </div>
  );
};

export default OrderTracking;
