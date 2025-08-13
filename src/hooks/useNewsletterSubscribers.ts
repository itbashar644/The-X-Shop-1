
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  subscribed_at: string;
}

export const useNewsletterSubscribers = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscribers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/newsletter/subscribers');
      if (!res.ok) throw new Error('Ошибка загрузки подписчиков');
      const data = await res.json();
      setSubscribers(data);
    } catch (err) {
      console.error('Error fetching newsletter subscribers:', err);
      setError('Не удалось загрузить список подписчиков');
      toast.error('Ошибка при загрузке списка подписчиков');
    } finally {
      setLoading(false);
    }
  };

  const sendNewsletter = async (subject: string, content: string) => {
    if (subscribers.length === 0) {
      toast.error('Нет подписчиков для рассылки');
      return false;
    }
    try {
      const res = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, content }),
      });
      if (!res.ok) throw new Error('Ошибка отправки рассылки');
      toast.success(`Рассылка успешно отправлена ${subscribers.length} подписчикам!`);
      return true;
    } catch (error) {
      console.error('Error sending newsletter:', error);
      toast.error('Ошибка при отправке рассылки. Попробуйте позже.');
      return false;
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  return { 
    subscribers, 
    loading, 
    error, 
    fetchSubscribers,
    sendNewsletter
  };
};
