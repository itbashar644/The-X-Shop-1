import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import AppLayout from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import StaticProductRedirect from "./pages/StaticProductRedirect";
import Cart from "./pages/Cart";
import OrderSuccess from "./pages/OrderSuccess";
import Account from "./pages/account/Account";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AuthCallback from "./pages/auth/AuthCallback";
import Contacts from "./pages/Contacts";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import Wishlist from "./pages/Wishlist";
import ResetPassword from "./pages/auth/ResetPassword";
import AdminPanel from "./pages/admin/AdminPanel";
import Delivery from "./pages/Delivery";
import ThankYou from "./pages/ThankYou";

// Создаем роутер с учетом требований Vercel для SPA
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        // Используем /* для обработки всех вложенных путей
        path: "catalog/*",
        element: <Catalog />,
      },
      {
        path: "product/:id",
        element: <ProductDetail />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "wishlist",
        element: <Wishlist />,
      },
      {
        path: "order-success",
        element: <OrderSuccess />,
      },
      {
        path: "account",
        element: <Account />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "auth/callback",
        element: <AuthCallback />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "contacts",
        element: <Contacts />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "delivery",
        element: <Delivery />,
      },
      {
        path: "privacy",
        element: <Privacy />,
      },
      {
        path: "terms",
        element: <Terms />,
      },
      {
        // Используем /* для обработки всех вложенных путей админки
        path: "admin/*",
        element: <AdminPanel />,
      },
      {
        path: "thankYou",
        element: <ThankYou />,
      },
      {
        // Перемещаем :filename в конец, чтобы он не перехватывал другие маршруты
        path: ":filename",
        element: <StaticProductRedirect />,
      },
    ],
  },
  {
    // Fallback для всех необработанных путей
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
 


  // Создаем клиент для React Query с настройками по умолчанию
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 минут кеширования
        refetchOnWindowFocus: false, // Не обновлять при фокусе окна
        retry: 2, // Повторять запросы 2 раза при ошибке
      },
    },
  });

  return (
    <HelmetProvider>
 
      <ThemeProvider defaultTheme="light" storageKey="the-x-shop-theme">
  
        <QueryClientProvider client={queryClient}>
  
          <AuthProvider>
 
            <CartProvider>
   
              <WishlistProvider>
       
                <RouterProvider router={router} />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;