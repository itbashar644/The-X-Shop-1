
// Common utility functions and constants for products

// Function for generating random rating in range from 4.7 to 4.9
export const generateRandomRating = (): number => {
  return Number((Math.random() * 0.2 + 4.7).toFixed(1));
};

// Helper function to save items to localStorage
export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save ${key} to storage:`, error);
  }
};

// Helper function to get items from localStorage
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  const savedData = localStorage.getItem(key);
  
  if (savedData) {
    try {
      return JSON.parse(savedData);
    } catch (error) {
      console.error(`Failed to parse saved ${key}:`, error);
      return defaultValue;
    }
  }
  
  return defaultValue;
};
