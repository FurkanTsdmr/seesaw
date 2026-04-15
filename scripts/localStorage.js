import { STORAGE_KEY } from "./config.js";

export const saveState = (objects, nextWeightValue) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ objects, nextWeightValue }),
  );
};

export const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearState = () => {
  localStorage.removeItem(STORAGE_KEY);
};
