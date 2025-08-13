
/**
 * Функционал чата с интеграцией с Telegram
 */

// Функция для инициализации чата
function initChat() {
  const chatButton = document.getElementById('chat-button');
  const chatContainer = document.getElementById('chat-container');
  
  if (!chatButton || !chatContainer) return;
  
  // Инициализируем состояние чата
  let chatState = getFromStorage('chat_state', {
    open: false,
    messages: []
  });
  
  // Обработчик нажатия на кнопку чата
  chatButton.addEventListener('click', function() {
    if (chatContainer.classList.contains('hidden')) {
      openChat();
    } else {
      closeChat();
    }
  });
  
  // Обработчик событий на документе, чтобы закрывать чат по клику вне его
  document.addEventListener('click', function(event) {
    if (!chatContainer.classList.contains('hidden')) {
      const isClickInsideChat = chatContainer.contains(event.target);
      const isClickOnChatButton = chatButton.contains(event.target);
      
      if (!isClickInsideChat && !isClickOnChatButton) {
        closeChat();
      }
    }
  });
  
  // Функция для открытия чата
  function openChat() {
    if (chatContainer.innerHTML.trim() === '' || chatContainer.classList.contains('hidden')) {
      renderChatInterface();
    }
    
    chatContainer.classList.remove('hidden');
    chatState.open = true;
    saveToStorage('chat_state', chatState);
    
    scrollToLatestMessage();
  }
  
  // Функция для закрытия чата
  function closeChat() {
    chatContainer.classList.add('hidden');
    chatState.open = false;
    saveToStorage('chat_state', chatState);
  }
  
  // Функция для рендеринга интерфейса чата
  function renderChatInterface() {
    const chatHTML = `
      <div class="chat-header">
        <h3>Чат с оператором</h3>
        <button class="chat-close-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="chat-body">
        <div class="chat-messages" id="chat-messages">
          ${renderChatMessages()}
        </div>
      </div>
      <div class="chat-footer">
        <textarea id="chat-input" placeholder="Введите сообщение..." rows="2" inputmode="text" enterkeyhint="send"></textarea>
        <button class="chat-send-btn" id="chat-send-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
    `;
    
    chatContainer.innerHTML = chatHTML;
    
    // Добавляем обработчики событий
    document.querySelector('.chat-close-btn').addEventListener('click', closeChat);
    const sendBtn = document.getElementById('chat-send-btn');
    const handleSendInteraction = function(event) {
      event.preventDefault();
      sendMessage();
    };

    sendBtn.addEventListener('pointerdown', handleSendInteraction);
    sendBtn.addEventListener('touchstart', handleSendInteraction);
    sendBtn.addEventListener('click', handleSendInteraction);
    sendBtn.addEventListener('touchend', handleSendInteraction);
    
    const chatInput = document.getElementById('chat-input');
    chatInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    });
    
    // Приветственное сообщение при первом открытии
    if (chatState.messages.length === 0) {
      addSystemMessage('Здравствуйте! Чем мы можем вам помочь?');
    }
  }
  
  // Функция для рендеринга сообщений чата
  function renderChatMessages() {
    return chatState.messages.map(message => {
      let messageClass = '';
      let nameLabel = '';
      
      switch (message.type) {
        case 'user':
          messageClass = 'user-message'; // Справа
          nameLabel = 'Вы';
          break;
        case 'operator':
          messageClass = 'operator-message'; // Слева
          nameLabel = 'Оператор';
          break;
        case 'system':
          messageClass = 'system-message';
          nameLabel = 'Система';
          break;
        default:
          messageClass = '';
          nameLabel = '';
      }
      
      return `
        <div class="chat-message ${messageClass}">
          <span class="message-name">${nameLabel}</span>
          <div class="message-content">${message.text}</div>
          <span class="message-time">${formatDate(message.time)}</span>
        </div>
      `;
    }).join('');
  }
  
  // Функция для добавления сообщения пользователя
  function addUserMessage(text) {
    const message = {
      type: 'user',
      text: text,
      time: new Date().toISOString()
    };
    
    chatState.messages.push(message);
    saveToStorage('chat_state', chatState);
    updateChatMessages();
  }
  
  // Функция для добавления сообщения оператора
  function addOperatorMessage(text) {
    const message = {
      type: 'operator',
      text: text,
      time: new Date().toISOString()
    };
    
    chatState.messages.push(message);
    saveToStorage('chat_state', chatState);
    updateChatMessages();
  }
  
  // Функция для добавления системного сообщения
  function addSystemMessage(text) {
    const message = {
      type: 'system',
      text: text,
      time: new Date().toISOString()
    };
    
    chatState.messages.push(message);
    saveToStorage('chat_state', chatState);
    updateChatMessages();
  }
  
  // Функция для обновления списка сообщений
  function updateChatMessages() {
    const chatMessagesEl = document.getElementById('chat-messages');
    if (chatMessagesEl) {
      chatMessagesEl.innerHTML = renderChatMessages();
      scrollToLatestMessage();
    }
  }
  
  // Функция для прокрутки к последнему сообщению
  function scrollToLatestMessage() {
    const chatMessagesEl = document.getElementById('chat-messages');
    if (chatMessagesEl) {
      chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    }
  }
  
  // Функция для форматирования даты
  function formatDate(dateString) {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  // Получение или создание уникального идентификатора чата
  function getChatId() {
    let chatId = getFromStorage('chat_id');
    if (!chatId) {
      chatId = `chat_${Date.now()}_${generateUUID()}`;
      saveToStorage('chat_id', chatId);
    }
    return chatId;
  }
  
  // Генерация UUID
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Получение информации об устройстве
  function getDeviceInfo() {
    try {
      return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
    } catch (error) {
      return {};
    }
  }

  // Функция для отправки сообщения
  function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Добавляем сообщение пользователя
    addUserMessage(message);
    
    // Очищаем поле ввода
    chatInput.value = '';
    
    // Отправляем сообщение в Telegram
    sendMessageToTelegram(message)
      .then(() => {
        addSystemMessage('Сообщение отправлено оператору. Ожидайте ответа.');
        
        // Демо ответ через 2 секунды
        setTimeout(() => {
          addOperatorMessage('Спасибо за обращение! Как я могу вам помочь?');
        }, 2000);
      })
      .catch(error => {
        console.error('Ошибка при отправке сообщения:', error);
        addSystemMessage('Произошла ошибка при отправке сообщения. Попробуйте позже.');
      });
  }

  // Функция для отправки сообщения через Supabase
  async function sendMessageToTelegram(message) {
    try {
      const chatId = getChatId();
      const deviceInfo = getDeviceInfo();

      const response = await fetch(`${CONFIG.supabaseUrl}/functions/v1/telegram-chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...CONFIG.apiHeaders
        },
        body: JSON.stringify({
          chatId,
          message,
          deviceInfo,
          timestamp: new Date().toISOString(),
          page: window.location.pathname,
          referrer: document.referrer || 'direct'
        })
      });
      
      if (!response.ok) {
        throw new Error('Ошибка сети при отправке сообщения');
      }
      
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Ошибка функции отправки');
      }

      return data;
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      throw error;
    }
  }
  
  // Восстанавливаем состояние чата
  if (chatState.open) {
    openChat();
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  initChat();
});
