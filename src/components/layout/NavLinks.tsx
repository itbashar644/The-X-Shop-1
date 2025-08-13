import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const NavLinks: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="hidden md:flex gap-6">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `transition-colors hover:text-primary ${
            isActive ? "text-primary font-medium" : "text-muted-foreground"
          }`
        }
      >
        Главная
      </NavLink>
      <NavLink
        to="/catalog"
        className={({ isActive }) =>
          `transition-colors hover:text-primary ${
            isActive ? "text-primary font-medium" : "text-muted-foreground"
          }`
        }
      >
        Каталог
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) =>
          `transition-colors hover:text-primary ${
            isActive ? "text-primary font-medium" : "text-muted-foreground"
          }`
        }
      >
        О нас
      </NavLink>
      <NavLink
        to="/contacts"
        className={({ isActive }) =>
          `transition-colors hover:text-primary ${
            isActive ? "text-primary font-medium" : "text-muted-foreground"
          }`
        }
      >
        Контакты
      </NavLink>
      {isAuthenticated && (
        <NavLink
          to="/account"
          className={({ isActive }) =>
            `transition-colors hover:text-primary ${
              isActive ? "text-primary font-medium" : "text-muted-foreground"
            }`
          }
        >
          Личный кабинет
        </NavLink>
      )}
    </nav>
  );
};