import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

interface OrderFormFieldsProps {
  isSubmitting: boolean;
}

const OrderFormFields: React.FC<OrderFormFieldsProps> = ({ isSubmitting }) => {
  const { register, setValue } = useFormContext();
  const { user } = useAuth();
  const { items: cartItems } = useCart();

  const [autoFilled, setAutoFilled] = useState(false);

  useEffect(() => {
    if (user && !autoFilled) {
      setValue('firstName', user.name || '');
      setValue('email', user.email || '');
      setValue('phone', (user as any).phone || '');
      setValue('address', (user as any).address || '');
      // Добавь другие поля, если у тебя есть в user
      setAutoFilled(true);
    }
  }, [user, setValue, autoFilled]);

  useEffect(() => {
    if (cartItems.length > 0 && !autoFilled) {
      const productNames = cartItems
        .map((item) => `${item.product.title} (${item.quantity} шт.)`)
        .join(', ');
      setValue('comment', `Мой заказ: ${productNames}`);
      setAutoFilled(true);
    }
  }, [cartItems, setValue, autoFilled]);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <h2 className="text-lg font-medium text-gray-900">Контактная информация</h2>
      </div>

      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
          Имя*
        </label>
        <input
          type="text"
          id="firstName"
          {...register('firstName', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
          Фамилия*
        </label>
        <input
          type="text"
          id="lastName"
          {...register('lastName', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email*
        </label>
        <input
          type="email"
          id="email"
          {...register('email', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Телефон*
        </label>
        <input
          type="tel"
          id="phone"
          {...register('phone', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={isSubmitting}
        />
      </div>

      <div className="sm:col-span-2">
        <h2 className="text-lg font-medium text-gray-900">Адрес доставки</h2>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Адрес*
        </label>
        <input
          type="text"
          id="address"
          {...register('address', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          Город*
        </label>
        <input
          type="text"
          id="city"
          {...register('city', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
          Почтовый индекс*
        </label>
        <input
          type="text"
          id="postalCode"
          {...register('postalCode', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={isSubmitting}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
          Комментарий к заказу
        </label>
        <textarea
          id="comment"
          {...register('comment')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
};

export default OrderFormFields;
