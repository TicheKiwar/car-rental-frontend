export  const  StorageService = {
     getItem:  (key: string) => {
        try {
          const item =  localStorage.getItem(key);
          return  item ? JSON.parse(item) : null;
        } catch (error) {
          console.error('Error reading from localStorage:', error);
          return null;
        }
      },
        
   saveToLocalStorage : (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  // Función para recuperar el objeto desde localStorage
   loadFromLocalStorage : (key) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key); 
      console.log(`Item with key "${key}" removed from localStorage.`);
    } catch (error) {
      console.error('Error removing item from localStorage:', error);
    }
  },
}