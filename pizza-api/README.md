# pizza-api — Spring Boot REST backend

Replaces the Express/MSW mock at `http://localhost:9009/api/order` with a JPA-backed API on **port 8080**.

## Package layout

```
com.pizza.api
├── config/          Cors + H2 seed data (toppings + demo user)
├── controller/      REST mappings
├── dto/             Request/response payloads
├── exception/       422/403/404/etc JSON { "message": "..." }
├── model/           JPA entities + enums
├── repository/      Spring Data JPA
└── service/         Business logic (mirrors backend/helpers.js)
```

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/order` | Place order (same body/response as helpers.js `postPizza`) |
| `GET` | `/api/order` | All orders |
| `GET` | `/api/order?userId=1` | Orders for a user |
| `GET` | `/api/order?userId=1&status=active` | Active orders |
| `GET` | `/api/order?userId=1&status=history` | Past / cancelled |
| `GET` | `/api/order/{id}` | One order |
| `PUT` | `/api/order/{id}` | Edit while inside cancel window |
| `DELETE` | `/api/order/{id}` | Cancel while inside cancel window |
| `POST` | `/api/order/{id}/complete` | Mark completed → history |
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Login |
| `GET` | `/api/auth/users/{id}` | Profile |
| `GET` | `/api/users/{id}/orders` | Home dashboard: active + history |
| `GET` | `/api/users/{id}/orders/active` | Active only |
| `GET` | `/api/users/{id}/orders/history` | History only |
| `GET` | `/api/toppings` | Topping catalog (ids 1–5) |

### Create order body (Form.js)

```json
{ "fullName": "Jane Doe", "size": "L", "toppings": ["1", "2"], "userId": 1 }
```

`userId` is optional (guest order). Success **201** shape matches the mock:

```json
{
  "message": "Thank you for your order, Jane Doe! Your large pizza with 2 toppings is on the way.",
  "data": { "size": "L", "customer": "Jane Doe", "toppings": ["Pepperoni", "Green Peppers"] }
}
```

Validation failures return **422** `{ "message": "..." }` with the same wording as `helpers.js`.

### Cancel / edit windows

| Size | Window |
|------|--------|
| S | 10 minutes |
| M | 15 minutes |
| L | 20 minutes |

After the window, `PUT` / `DELETE` return **403**.

### Demo account (seeded on startup)

- username: `demo`
- password: `demo1234`

## Run

```bash
./mvnw.cmd spring-boot:run
```

- API: http://localhost:8080  
- H2 console: http://localhost:8080/h2-console — JDBC URL `jdbc:h2:mem:pizza_db`, user `sa`, blank password

## Frontend switch (later)

In `Form.js`, change:

```js
axios.post('http://localhost:9009/api/order', form)
```

to:

```js
axios.post('http://localhost:8080/api/order', form)
```
