
/**
 * Функционал для работы с формами
 */

// Функция для отправки формы обратной связи
async function submitContactForm(event) {
  event.preventDefault();
  
  const form = event.target;
  const name = form.querySelector('#name').value;
  const email = form.querySelector('#email').value;
  const message = form.querySelector('#message').value;
  
  try {
    // Отправляем данные формы в Supabase
    const response = await fetch('https://lpwvhyawvxibtuxfhitx.supabase.co/functions/v1/contact-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.supabaseKey}`
      },
      body: JSON.stringify({ name, email, message })
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при отправке формы');
    }
    
    // Показываем уведомление об успешной отправке
    showNotification('Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.');
    
    // Очищаем форму
    form.reset();
  } catch (error) {
    console.error('Ошибка при отправке формы:', error);
    showNotification('Ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
  }
}
