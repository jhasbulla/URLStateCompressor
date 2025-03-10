import { useState, useEffect } from 'react';
import JSONCrush from 'jsoncrush';

/**
 * Custom hook to synchronize a single URL parameter with React state.
 * 
 * @param key - The key for the URL parameter.
 * @param defaultValue - The default value if the URL parameter is not present.
 * @returns A tuple containing the current state and a function to update it.
 */
export function useURLState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  /**
   * Retrieves and decompresses the URL parameter.
   * If the parameter doesn't exist or fails to parse, returns the default value.
   *
   * @returns The parsed value of type T from the URL or the default value.
   */
  const getParam = (): T => {
    const params = new URLSearchParams(window.location.search);
    const compressed = params.get(key);
    if (compressed) {
      try {
        const jsonString = JSONCrush.uncrush(decodeURIComponent(compressed));
        if (!jsonString) return defaultValue;
        return JSON.parse(jsonString) as T;
      } catch (error) {
        console.error(`Error decompressing URL parameter ${key}:`, error);
        return defaultValue;
      }
    }
    return defaultValue;
  };

  const [state, setState] = useState<T>(getParam());

  /**
   * useEffect hook that updates the URL whenever the state changes.
   * It compresses the state to a compact string, encodes it, and updates the URL parameter.
   */
  useEffect(() => {
    try {
      const jsonString = JSON.stringify(state);
      const compressed = JSONCrush.crush(jsonString);
      const params = new URLSearchParams(window.location.search);
      params.set(key, encodeURIComponent(compressed));
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, '', newUrl);
    } catch (error) {
      console.error(`Error updating URL for parameter ${key}:`, error);
    }
  }, [state, key]);

  /**
   * useEffect hook that listens to the browser's popstate event.
   * This ensures that when the user navigates (e.g., using the back or forward buttons),
   * the state is updated to reflect the URL parameter.
   */
  useEffect(() => {
    // Event handler to update the state based on the URL parameter when navigation occurs
    const onPopState = () => {
      setState(getParam());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [key]);

  return [state, setState];
}
