// Подавляем логи из errorHandler в тестах
// Мокаем console.error до загрузки модулей, чтобы перехватить логи из errorHandler
const originalConsoleError = console.error;

// Проверяем, что мы в тестовом окружении
if (typeof Bun !== 'undefined' && Bun.main.endsWith('.test.ts')) {
  console.error = (...args: unknown[]) => {
    // Подавляем только логи из errorHandler, остальные оставляем
    const message = args[0]?.toString() || '';
    if (message.includes('Error Handler Middleware:') || message.includes('Unhandled error:')) {
      return; // Подавляем логи из errorHandler
    }
    originalConsoleError.apply(console, args);
  };
}

