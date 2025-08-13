import { API_BASE_URL } from "@/types/variables";

export interface PaymentInitResponse {
  paymentId: string;
  formUrl: string;
  paymentStatus: 'NEW' | 'FORM_SHOWED' | 'PAID' | 'REJECTED';
}

export interface PaymentStatusResponse {
  orderId: string;
  status: 'SUCCESS' | 'FAILED' | 'PROGRESS';
  amount: number;
  currency: string;
  paymentDate?: string;
}

export const initPayment = async (
  orderId: string,
  amount: number,
  description: string,
  email?: string
): Promise<PaymentInitResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        amount,
        description,
        email,
        paymentMethod: 'MIR'
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error initializing payment:', error);
    throw error;
  }
};

export const checkPaymentStatus = async (
  paymentId: string
): Promise<PaymentStatusResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/status`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
};

export const createMirPaymentForm = async (
  container: HTMLElement,
  options: {
    amount: number;
    orderId: string;
    description: string;
    onSuccess: (data: { orderId: string; status: string }) => void;
    onError: (error: string) => void;
  }
): Promise<boolean> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const form = document.createElement('form');
    form.className = 'mir-payment-form';
    form.innerHTML = `
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Номер карты</label>
        <input type="text" class="w-full p-2 border rounded" placeholder="2200 0000 0000 0000" pattern="[0-9]{16,19}" required>
      </div>
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium mb-1">Срок действия</label>
          <input type="text" class="w-full p-2 border rounded" placeholder="ММ/ГГ" pattern="(0[1-9]|1[0-2])\/[0-9]{2}" required>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">CVV</label>
          <input type="password" class="w-full p-2 border rounded" placeholder="123" pattern="[0-9]{3}" required>
        </div>
      </div>
      <button type="submit" class="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition">
        Оплатить ${options.amount.toLocaleString()} ₽
      </button>
    `;

    form.onsubmit = async (e) => {
      e.preventDefault();
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        options.onSuccess({ orderId: options.orderId, status: 'SUCCESS' });
      } catch (error) {
        options.onError('Payment failed');
      }
    };

    container.appendChild(form);
    return true;
  } catch (error) {
    console.error('Error creating MIR payment form:', error);
    return false;
  }
};