import { useEffect, useState } from 'react';

/**
 *@title useDebounce Hook
 *@notice This hook is used to debounce a value. Debouncing is a process that delays the processing of a function until after a certain amount of time has passed since the last time the function was called. The hook uses the `useEffect` and `useState` hooks from React to manage the debounced value.
 *
 *@param value - The value to be debounced. This can be of any type.
 *@param delay - The delay in milliseconds after which the debounced value will update to the latest value.
 *
 *@returns any - Returns the debounced value. The returned value will only update to the latest value after the specified delay has passed since the last time the value was changed.
 */

const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
