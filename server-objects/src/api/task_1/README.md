# Task 1 — API

## 1) Задание
- Получить пользователей из `https://jsonplaceholder.typicode.com/users`
- Показать список на странице (имя, email, username)
- Запросы к бэкенду — через `frontend/src/api.ts`

## 2) Установка зависимостей
```bash
cd backend && npm install
cd ../frontend && npm install
```

## 3) Сборка backend (рекомендуется wsjs)
- Сборка выполняется через **wsjs** (см. корневой `README.md`)
- Используется конфиг `server-objects/ssjs.config.json`

## 4) Запуск frontend (dev)
```bash
cd frontend
npm run dev
```

## 5) WebSoft
- Создать custom web template
- `object_code`: `api_task1_server`
- Ссылка на шаблон: `.../backend/build/index.js`
- Включить анонимный доступ для dev

## 6) Структура (кратко)
- `backend/src/index.ts` — точка входа
- `backend/src/modules/users.ts` — запрос к внешнему API
- `frontend/src/components/Users.tsx` — список пользователей
