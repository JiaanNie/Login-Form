import { useState, useEffect } from "react";

// the purpose of this function is read value from a localStore for a given key
// but if this function is being run on a server, a non-window machine
const getLocalValue = (key, initValue) => {
  if (typeof window === "undefined") return initValue;

  // if the key does not exist in the local storage it will return null
  const localValue = JSON.parse(localStorage.getItem(key));
  if (localValue) return localValue;
  // if a arrow function pass in as a param invoke the function here and return the result
  if (initValue instanceof Function) return initValue();
  return initValue;
};

const useLocalStorage = (key, initValue) => {
  const [value, setValue] = useState(() => getLocalValue(key, initValue));
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
