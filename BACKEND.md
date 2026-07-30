# Baytak Backend (NestJS)

Companion to `docs/PROJECT.md`. Covers the API built in this session: auth, service
categories, technicians, addresses, orders (+ live status via Socket.io), and reviews.

---

## 1. Module map

```
backend/src/
├── main.ts
├── app.module.ts
├── config/
│   ├── configuration.ts        # port, CORS origin, JWT secrets/expiry
│   └── typeorm.config.ts       # MySQL connection + entity registry (synchronize: false)
├── common/
│   ├── transformers/numeric.transformer.ts   # BIGINT/DECIMAL <-> JS number
│   ├── decorators/current-user.decorator.ts
│   └── filters/http-exception.filter.ts
├── entities/                    # one TypeORM entity per table in database/schema.sql
└── modules/
    ├── auth/                    # register, login, refresh (rotating), logout, me
    ├── service-categories/      # public catalog
    ├── technicians/             # list + filter + detail
    ├── addresses/                # a user's saved addresses
    ├── orders/                   # create/list/detail/status + Socket.io gateway
    └── reviews/                  # one review per completed order, updates technician rating
```

**Not built yet** (flagged in `PROJECT.md`'s roadmap, pick up in a later session):
favorites, payment-methods, notifications, the admin back-office, and technician-side
auth (technicians currently only exist as data — matching/assignment logic isn't
wired to an endpoint yet).

---

## 2. Auth flow

- Passwords hashed with **bcrypt**, 12 salt rounds. Never logged, never returned
  (`@Exclude()` on the entity + `select: false` on the column).
- **Access token**: 15 min, signed with `JWT_ACCESS_SECRET`, sent as
  `Authorization: Bearer <token>`.
- **Refresh token**: 30 days, signed with a *different* secret
  (`JWT_REFRESH_SECRET`). The raw token is never stored — only its SHA-256 hash, in
  `auth_tokens`, alongside `user_agent` / `ip_address` for basic session visibility.
- **Rotation**: every call to `POST /auth/refresh` revokes the presented refresh
  token (`revoked_at`) and issues a brand new pair. A stolen-then-reused refresh
  token fails immediately because it's already revoked — this is what "rotation"
  buys you over a single long-lived refresh token.
- `POST /auth/logout` revokes the current refresh token so it can never be replayed.

## 3. Endpoints

| Method | Path                              | Auth | Notes |
|--------|------------------------------------|------|-------|
| POST   | `/api/v1/auth/register`            | —    | phone + password (+ optional email/city/district) |
| POST   | `/api/v1/auth/login`               | —    | phone + password |
| POST   | `/api/v1/auth/refresh`             | refresh token (body) | rotates the token |
| POST   | `/api/v1/auth/logout`              | refresh token (body) | revokes it |
| GET    | `/api/v1/auth/me`                  | access token | decoded JWT claims |
| GET    | `/api/v1/service-categories`       | —    | matches frontend `ServiceCategory[]` exactly |
| GET    | `/api/v1/technicians?category=&minRating=&maxPrice=&sortBy=` | — | matches frontend `Technician[]` exactly |
| GET    | `/api/v1/technicians/:id`          | —    | |
| GET    | `/api/v1/addresses/mine`           | access | |
| POST   | `/api/v1/addresses`                | access | |
| POST   | `/api/v1/orders`                   | access | creates with status `pending` + first history row |
| GET    | `/api/v1/users/:userId/orders`     | access | `userId` must match the caller — matches `lib/api.ts` |
| GET    | `/api/v1/orders/:id`                | access | 403 if it isn't yours |
| PATCH  | `/api/v1/orders/:id/status`         | *open for now* | see note below |
| POST   | `/api/v1/orders/:orderId/reviews`   | access | only on `completed` orders, one per order |

> `PATCH /orders/:id/status` is meant for the technician/admin side, which isn't
> authenticated yet — it's left open in this session so you can exercise the state
> machine and the WebSocket push end-to-end. Lock it down with a technician/admin
> guard once that auth exists.

**Order status state machine** (enforced in `OrdersService.updateStatus`):
`pending → confirmed → in_progress → completed`, with `cancelled` reachable from
`pending`, `confirmed`, or `in_progress`. Every transition appends a row to
`order_status_history` and emits an internal `order.status.changed` event.

**Response shapes are hand-mapped to match `frontend/src/lib/types.ts` exactly**
(`Technician`, `Order`) — flat `categorySlug`/`categoryLabel` instead of a nested
relation object, `orderNumber` formatted as `#1010`, etc. Once you point
`NEXT_PUBLIC_API_URL` at this API, the frontend needs zero type changes.

## 4. Live order tracking (Socket.io)

`OrdersGateway` runs on the `/orders` namespace. `OrdersService` never talks to the
gateway directly — it emits an `order.status.changed` event via `EventEmitter2`,
and the gateway (which is just an `@OnEvent` listener) pushes it to whichever
clients joined that order's room:

```
client  --socket.emit('joinOrder', orderId)-->  server (joins room `order:{id}`)
server  --order.status.changed event-->          server (OrdersService.updateStatus)
server  --socket broadcast to room-->            client ('order.status.changed')
```

A ready-to-use frontend hook (`useOrderStatusSocket`) is in the chat response —
drop it in as `src/hooks/useOrderStatusSocket.ts`, `npm install socket.io-client`,
and call it from `OrderDetails`.

## 5. Environment variables (`backend/.env`)

```
PORT=4000
CORS_ORIGIN=http://localhost:3000

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=baytak_db

JWT_ACCESS_SECRET=replace-with-a-long-random-string
JWT_REFRESH_SECRET=replace-with-a-different-long-random-string
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d
```

Generate real secrets instead of typing something memorable:
```bat
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```
Run it twice — once for each secret — and never commit `.env`.

## 6. A gap worth knowing about

The frontend's `lib/api.ts` (built last session) doesn't attach an
`Authorization` header yet, so calls to guarded endpoints
(`/users/:userId/orders`, `/addresses/*`, `/orders`) will get a `401`, which the
client's `catch` block quietly treats the same as "backend unreachable" and falls
back to mock data. Nothing is broken — the dashboard just won't show *real* data
until the frontend has an actual login screen and a token store. That's the
natural next increment: a `/login` page, a small Zustand auth store, and wiring
that token into `lib/api.ts`'s `fetch` calls.

## 7. Roadmap (updated)

- [x] NestJS scaffold, TypeORM entities matching `database/schema.sql`
- [x] Auth: register/login/refresh-rotation/logout, bcrypt, guarded routes
- [x] Service categories, technicians (filter/sort), addresses, orders, reviews
- [x] Socket.io live order-status gateway
- [ ] Frontend login screen + token store + `lib/api.ts` auth headers
- [ ] Technician-side auth + `PATCH /orders/:id/status` locked to technician/admin
- [ ] Favorites, payment methods, notifications modules
- [ ] Admin back-office
- [ ] Payments integration (mada / Apple Pay / STC Pay)
- [ ] Deployment: Nginx reverse proxy, process manager (PM2 or Docker), production MySQL
