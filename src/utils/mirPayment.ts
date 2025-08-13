
/**
 * Утилиты для работы с платежной системой Мир
 * 
 * Примечание: В рабочем проекте данные функции заменяются на
 * интеграцию с реальным API платежной системы
 */

// Типы данных для платежной системы
export interface MirPaymentForm {
  amount: number;
  description: string;
  orderId: string;
  email: string;
  returnUrl: string;
}

export interface MirPaymentResponse {
  orderId: string;
  formUrl: string;
  status: string;
  success: boolean;
}

/**
 * Инициализация платежа через систему Мир
 * 
 * @param paymentData Данные для платежа
 * @returns Информация об инициализированном платеже
 */
export const initMirPayment = async (paymentData: MirPaymentForm): Promise<MirPaymentResponse> => {
  console.log("Инициализация платежа через систему Мир", paymentData);
  
  // Имитация задержки запроса к API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // В рабочем проекте здесь должен быть запрос к API системы Мир
  // Возвращаем тестовые данные для демонстрации
  return {
    orderId: paymentData.orderId,
    formUrl: `https://payment.mir.ru/payment/form/${paymentData.orderId}`,
    status: "CREATED",
    success: true
  };
};

/**
 * Проверка статуса платежа через систему Мир
 * 
 * @param orderId Идентификатор заказа
 * @returns Статус платежа
 */
export const checkMirPaymentStatus = async (orderId: string): Promise<string> => {
  console.log("Проверка статуса платежа через систему Мир", orderId);
  
  // Имитация задержки запроса к API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // В рабочем проекте здесь должен быть запрос к API системы Мир
  // Имитируем случайный статус для демонстрации
  const statuses = ["COMPLETED", "PENDING", "FAILED", "EXPIRED"];
  const randomIndex = Math.floor(Math.random() * statuses.length);
  
  return statuses[randomIndex];
};

/**
 * Создание безопасного токена для сохранения данных карты
 * 
 * @param cardNumber Маскированный номер карты (например, "54** **** **** 1234")
 * @returns Токен сохраненной карты
 */
export const createMirCardToken = async (cardNumber: string): Promise<string> => {
  console.log("Создание токена карты Мир", cardNumber);
  
  // Имитация задержки запроса к API
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // В рабочем проекте здесь должен быть запрос к API системы Мир
  // Возвращаем тестовый токен для демонстрации
  return `mir-token-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * Создать компонент для платежной формы МИР
 * 
 * @param container Элемент-контейнер для встраивания формы
 * @param options Параметры платежной формы
 * @returns Promise с результатом инициализации формы
 */
export const createMirPaymentForm = async (
  container: HTMLElement, 
  options: {
    amount: number;
    orderId: string;
    description?: string;
    theme?: 'light' | 'dark';
    onSuccess?: (result: any) => void;
    onError?: (error: any) => void;
  }
): Promise<boolean> => {
  console.log("Создание платежной формы МИР", options);
  
  // Демонстрационная реализация для отображения формы
  container.innerHTML = `
    <div class="p-4 border rounded-md">
      <div class="flex items-center mb-3">
        <img src="https://via.placeholder.com/60x30?text=МИР" alt="МИР" class="mr-2" />
        <span class="font-medium">Платежная система МИР</span>
      </div>
      <div class="space-y-3">
        <div>
          <label class="block text-sm mb-1">Номер карты</label>
          <input type="text" class="w-full px-3 py-2 border rounded" placeholder="0000 0000 0000 0000" />
        </div>
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block text-sm mb-1">Срок действия</label>
            <input type="text" class="w-full px-3 py-2 border rounded" placeholder="ММ/ГГ" />
          </div>
          <div class="w-20">
            <label class="block text-sm mb-1">CVV</label>
            <input type="text" class="w-full px-3 py-2 border rounded" placeholder="000" />
          </div>
        </div>
        <div>
          <label class="block text-sm mb-1">Имя держателя карты</label>
          <input type="text" class="w-full px-3 py-2 border rounded" placeholder="IVAN IVANOV" />
        </div>
        <div class="mt-4">
          <button class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" id="mir-submit-button">
            Оплатить ${options.amount.toLocaleString()} ₽
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Добавляем обработчик для демонстрации
  const submitButton = container.querySelector('#mir-submit-button');
  if (submitButton) {
    submitButton.addEventListener('click', () => {
      // Имитация процесса оплаты
      container.innerHTML = `
        <div class="p-4 border rounded-md text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Обработка платежа...</p>
        </div>
      `;
      
      // Имитация задержки и успешного результата оплаты
      setTimeout(() => {
        container.innerHTML = `
          <div class="p-4 border rounded-md text-center">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium mb-2">Платеж успешно выполнен!</h3>
            <p class="text-sm text-gray-600 mb-4">Номер заказа: ${options.orderId}</p>
          </div>
        `;
        
        // Вызываем callback если он предоставлен
        if (options.onSuccess) {
          options.onSuccess({ orderId: options.orderId, status: 'COMPLETED' });
        }
      }, 2000);
    });
  }
  
  return true;
};
