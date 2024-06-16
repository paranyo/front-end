import { useEffect, useState } from "react";

const shortenWords = (str: string, length = 26) => {
  let result = '';
  if (str.length > length) {
    result = str.substring(0, length - 2) + '...';
  } else {
    result = str;
  }
  return result;
};

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay)
    return () => clearTimeout(timer);
  }, [value, delay])
  return debouncedValue
}

const toWon = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export {
  shortenWords,
  useDebounce,
  toWon
}