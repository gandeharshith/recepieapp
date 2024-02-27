import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [likedItems, setLikedItems] = useState([]);

  useEffect(() => {
    // Load liked items from AsyncStorage when the app starts
    const loadLikedItems = async () => {
      try {
        const likedItemsString = await AsyncStorage.getItem('likedItems');
        if (likedItemsString) {
          setLikedItems(JSON.parse(likedItemsString));
        }
      } catch (error) {
        console.error('Error loading liked items:', error);
      }
    };

    loadLikedItems();
  }, []);

  const toggleLike = (item) => {
    const index = likedItems.findIndex((likedItem) => likedItem.idMeal === item.idMeal);

    if (index !== -1) {
      // Item is already liked, unlike it
      const updatedLikedItems = [...likedItems];
      updatedLikedItems.splice(index, 1);
      setLikedItems(updatedLikedItems);
    } else {
      // Item is not liked, like it
      const updatedLikedItems = [...likedItems, item];
      setLikedItems(updatedLikedItems);
    }
  };

  // Save liked items to AsyncStorage whenever likedItems change
  useEffect(() => {
    const saveLikedItems = async () => {
      try {
        await AsyncStorage.setItem('likedItems', JSON.stringify(likedItems));
      } catch (error) {
        console.error('Error saving liked items:', error);
      }
    };

    saveLikedItems();
  }, [likedItems]);

  return (
    <AppContext.Provider value={{ likedItems, toggleLike }}>
      {children}
    </AppContext.Provider>
  );
};
