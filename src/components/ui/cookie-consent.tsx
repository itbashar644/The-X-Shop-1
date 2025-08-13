
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAcceptedCookies = localStorage.getItem("cookiesAccepted");
    if (!hasAcceptedCookies) {
      // Show cookie consent after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-2 left-0 right-0 z-50 mx-auto max-w-xs px-2">
      <Card className="shadow-lg py-0">
        <CardContent className="pt-2 pb-0 text-xs">
          <p>Мы используем cookies. <Link to="/privacy" className="text-primary underline">Подробнее</Link></p>
        </CardContent>
        <CardFooter className="flex justify-end gap-1 pb-2 pt-0">
          <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)} className="h-6 text-xs px-2">
            Нет
          </Button>
          <Button size="sm" onClick={acceptCookies} className="h-6 text-xs px-2">
            OK
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
