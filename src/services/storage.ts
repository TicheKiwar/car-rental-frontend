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
}