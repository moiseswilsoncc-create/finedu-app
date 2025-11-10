// src/utils/logger.ts

export const logInfo = (...args: any[]) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(...args);
  }
};

export const logWarn = (...args: any[]) => {
  if (process.env.NODE_ENV !== "production") {
    console.warn(...args);
  }
};

export const logError = (...args: any[]) => {
  // Los errores siempre se muestran, incluso en producción
  console.error(...args);
};
