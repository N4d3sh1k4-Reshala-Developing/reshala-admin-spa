# Решение ошибки 403 при использовании Docker

## Проблема

- **Через Vite (http://localhost:5173)**: ✅ 401 Unauthorized (запрос дошел до
  бэкенда)
- **Через Docker (http://localhost:8186)**: ❌ 403 Forbidden (доступ запрещен)

Это означает что бэкенд проверяет какой-то заголовок или политику и отказывает
для порта 8186.

## Решения (в порядке вероятности)

### 1. Проверить логи бэкенда

Запустите бэкенд с verbose логами и посмотрите почему 403:

```bash
# Запустите бэкенд с DEBUG логами
# Ищите сообщения об отказе доступа, whitelist, CORS и т.д.
```

### 2. Проверить CORS политику на бэкенде

Убедитесь что бэкенд разрешает:

- Origin: `http://localhost:8186`
- Host header: `localhost:8180` (или на что мы его установили в nginx)
- Methods: `POST, OPTIONS, GET`
- Credentials: `true`

### 3. Проверить IP whitelist

Может быть на бэкенде есть IP whitelist. Убедитесь что:

- `localhost` / `127.0.0.1` добавлены
- `host.docker.internal` добавлена (если используется)

### 4. Попробовать разные Host headers

Отредактируйте [nginx.conf](nginx.conf) и измените:

```nginx
# Вариант 1 (текущий):
proxy_set_header Host localhost:8180;

# Вариант 2: без порта
proxy_set_header Host localhost;

# Вариант 3: IP адрес
proxy_set_header Host 127.0.0.1;

# Вариант 4: оригинальный хост клиента
proxy_set_header Host $host;
```

Затем пересоберите контейнер:

```bash
docker compose down
docker compose up --build -d
```

### 5. Проверить доступ из Docker контейнера

Запустите команду в контейнере:

```bash
docker exec reshala-admin-spa curl -v http://host.docker.internal:8180/api/v0/auth/login
```

Это покажет может ли контейнер подключиться к бэкенду.

## Текущая конфигурация

- **Frontend**: http://localhost:8186
- **Backend**: http://host.docker.internal:8180/api (из Docker)
- **API endpoint**: /api/v0/auth/login
- **Method**: POST
- **Data**: `{ email, password, rememberMe }`

## Проверка успеха

Успешный запрос должен вернуть:

- ✅ Status: **401 Unauthorized** (если креденшалы неверные)
- ✅ Response: JSON с сообщением ошибки

Вместо:

- ❌ Status: **403 Forbidden** (доступ запрещен)
