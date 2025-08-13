
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash } from "lucide-react";
import { toast } from "sonner";

interface AddressListProps {
  addresses: string[];
  onAddAddress: (address: string) => void;
  onRemoveAddress: (address: string) => void;
}

const AddressList = ({ addresses, onAddAddress, onRemoveAddress }: AddressListProps) => {
  const [newAddress, setNewAddress] = React.useState("");

  const handleAddAddress = () => {
    if (newAddress.trim() && !addresses.includes(newAddress)) {
      onAddAddress(newAddress);
      setNewAddress("");
      toast.success("Адрес добавлен в избранное");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-md font-semibold">Избранные адреса доставки</h3>
      
      <div className="space-y-2">
        {addresses.length > 0 ? (
          addresses.map((address, index) => (
            <div key={index} className="flex items-center gap-2 p-3 border rounded-md">
              <div className="flex-1">
                <p className="text-sm">{address}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onRemoveAddress(address)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">У вас пока нет избранных адресов</p>
        )}
      </div>
      
      <div className="flex gap-2">
        <Input 
          placeholder="Новый адрес доставки" 
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
        />
        <Button 
          type="button" 
          variant="outline"
          onClick={handleAddAddress}
        >
          <Plus className="h-4 w-4 mr-2" />
          Добавить
        </Button>
      </div>
    </div>
  );
};

export default AddressList;
