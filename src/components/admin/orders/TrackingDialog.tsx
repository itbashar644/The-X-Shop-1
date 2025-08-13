
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck } from "lucide-react";

interface TrackingDialogProps {
  orderNumber: number;
  initialTrackingNumber: string;
  initialTrackingUrl: string;
  onSubmit: (trackingNumber: string, trackingUrl: string) => void;
}

const TrackingDialog: React.FC<TrackingDialogProps> = ({
  orderNumber,
  initialTrackingNumber,
  initialTrackingUrl,
  onSubmit,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber);
  const [trackingUrl, setTrackingUrl] = useState(initialTrackingUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(trackingNumber, trackingUrl);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-gray-500"
        title="Трек-номер"
      >
        <Truck className="h-4 w-4" />
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Информация о трекинге</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tracking-number">Трек-номер</Label>
              <Input
                id="tracking-number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Введите номер отслеживания"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tracking-url">Ссылка для отслеживания</Label>
              <Input
                id="tracking-url"
                value={trackingUrl}
                onChange={(e) => setTrackingUrl(e.target.value)}
                placeholder="https://track.service.com/your-tracking-number"
              />
            </div>
            
            <div className="text-sm text-muted-foreground">
              Заказ #{orderNumber}
            </div>
            
            <DialogFooter className="sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Отмена
              </Button>
              <Button type="submit">Сохранить</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TrackingDialog;
