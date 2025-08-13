import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { User, Package, LogOut } from "lucide-react";
import AdminPanelLink from "./AdminPanelLink";

interface AccountSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const AccountSidebar: React.FC<AccountSidebarProps> = ({
  activeTab,
  setActiveTab,
  onLogout
}) => {
  const { user } = useAuth();

  // Исправлено: предполагается, что поле аватара называется avatarUrl или avatar
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");

  if (!user) return null;

  return (
    <>
      <AdminPanelLink />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full overflow-hidden shadow-lg border-2 border-primary bg-background flex items-center justify-center"
              >
                <img
                  src={avatarUrl || "/images/00099aa0-4965-4836-89c9-6a5533fe4e4e.png"}
                  alt="profile"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button 
            variant={activeTab === "profile" ? "default" : "outline"} 
            className="w-full mb-4 justify-start"
            onClick={() => {
              setActiveTab("profile");
            }}
          >
            <User className="h-4 w-4 mr-2" />
            Личные данные
          </Button>
          <Button 
            variant={activeTab === "orders" ? "default" : "outline"} 
            className="w-full mb-4 justify-start"
            onClick={() => {
              setActiveTab("orders");
            }}
          >
            <Package className="h-4 w-4 mr-2" />
            Мои заказы
          </Button>
          <Button 
            variant="destructive" 
            className="w-full justify-start"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Выход
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default AccountSidebar;
