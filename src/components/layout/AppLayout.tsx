
import { Outlet } from "react-router-dom";
import YandexMetrika from "@/components/analytics/YandexMetrika";
import ChatWidget from "@/components/chat/ChatWidget";
import { Toaster } from "@/components/ui/sonner";
import ScrollToTop from "@/components/ScrollToTop";

const AppLayout = () => {
  return (
    <>
      <ScrollToTop />
      <YandexMetrika />
      <Outlet />
      <ChatWidget />
      <Toaster />
    </>
  );
};

export default AppLayout;
