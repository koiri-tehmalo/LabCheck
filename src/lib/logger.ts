const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  error: (...args: unknown[]) => {
    if (isDevelopment) console.error('[ERROR]', ...args);
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment) console.warn('[WARN]', ...args);
  },
  info: (...args: unknown[]) => {
    if (isDevelopment) console.info('[INFO]', ...args);
  },
};
