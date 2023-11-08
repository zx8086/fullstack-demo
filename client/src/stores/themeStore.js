// src/stores/themeStore.js
import { writable } from 'svelte/store';

export const createThemeStore = () => {
  const { subscribe, set, update } = writable('TH'); // default value

  if (typeof window !== 'undefined') {
    // We are in the browser, localStorage is available
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      set(storedTheme);
    }

    return {
      subscribe,
      set: (value) => {
        localStorage.setItem('theme', value);
        set(value);
      },
      // any other methods you want to add
    };
  } else {
    // We are on the server, just return the store without localStorage logic
    return {
      subscribe,
      set,
      // any other methods you want to add
    };
  }
};

export const themeStore = createThemeStore();
