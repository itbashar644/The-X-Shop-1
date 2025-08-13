
import { Link } from "react-router-dom";
import { NewsletterSignup } from "../marketing/NewsletterSignup";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container px-4 py-4 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3">The X Shop</h3>
            <p className="text-muted-foreground text-sm">
              Ваш надежный магазин товаров из Китая
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">Информация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:underline">О нас</Link>
              </li>
              <li>
                <Link to="/delivery" className="hover:underline">Доставка</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:underline">Условия использования</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:underline">Политика конфиденциальности</Link>
              </li>
            </ul>
          </div>
          <div>
            <NewsletterSignup />
          </div>
        </div>
        <div className="border-t mt-4 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">&copy; 2020-2025 The X Shop. Все права защищены.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/terms" className="text-sm text-muted-foreground hover:underline">Условия использования</Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:underline">Политика конфиденциальности</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
