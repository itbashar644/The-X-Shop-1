
 
export const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3001/api'
  : '/api';
  
export const WS_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'ws://localhost:3001' // или 3001, если используете один порт
  : 'wss://the-x.shop';