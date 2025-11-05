# apptest003 - Тестовое задание: Сервис управления задачами (Task Management Service)

## Установка и настройка

```bash
# Установка зависимостей
bun install

# Запуск PostgreSQL и Redis
docker-compose up -d postgres redis

# Применение схемы базы данных
bun run db:push
```

## Переменные окружения

Создайте файл `.env` в корне проекта:

```env
# Database Configuration
DATABASE_URL=postgresql://apptest003:apptest003@localhost:5432/apptest003

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Application Configuration
PORT=3000
NODE_ENV=development
```

## Запуск приложения

```bash
# Разработка (с hot-reload)
bun run dev

# Eslint
bun lint
bun lint:fix

# Запуск тестов
bun test

# Запуск тестов с покрытием
bun test:coverage
```

## Остановка PostgreSQL и Redis

```bash
docker-compose down
```

## Swagger

Прикручена документация по API http://localhost:3000/swagger
