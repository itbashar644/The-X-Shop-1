
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Set page title
document.title = 'The X Shop | Товары из Китая для вашего дома';

// Set language for better SEO
document.documentElement.lang = 'ru';

createRoot(document.getElementById("root")!).render(<App />);
 