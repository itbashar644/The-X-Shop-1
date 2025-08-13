
import React, { useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { trackGoal } from '@/utils/metrika';

const ProductNotFound = () => {
  const { id } = useParams<{ id: string }>();
  
  // Отслеживаем обращение к несуществующим товарам
  useEffect(() => {
    trackGoal('product_not_found', { product_id: id });
  }, [id]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Товар не найден</h1>
        <p className="text-muted-foreground mb-4">
          Запрашиваемый товар не существует или был удален
        </p>
        <Button asChild>
          <Link to="/catalog">Вернуться в каталог</Link>
        </Button>
      </div>
    </div>
  );
};

export default ProductNotFound;
