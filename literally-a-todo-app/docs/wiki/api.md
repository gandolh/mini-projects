# API Reference

Base URL: `http://127.0.0.1:3000`

All request bodies are JSON. All responses are JSON unless noted.

## Todo object

```json
{
  "id": 1,
  "title": "Buy milk",
  "completed": 0,
  "position": 1
}
```

`completed` is an integer: `0` = false, `1` = true.  
`position` is 1-based and determines display order.

---

## GET /api/todos

Returns all todos ordered by `position` ascending.

**Response 200**
```json
[
  { "id": 1, "title": "Buy milk", "completed": 0, "position": 1 },
  { "id": 2, "title": "Walk dog", "completed": 1, "position": 2 }
]
```

---

## POST /api/todos

Creates a new todo. Position is set to `MAX(position) + 1`.

**Request body**
```json
{ "title": "Buy milk" }
```

**Response 201** — the created todo object  
**Response 400** `{ "error": "title is required" }` — if the body, the title or a string title is missing or blank

---

## PATCH /api/todos/reorder

Reorders todos by reassigning positions. Must be called before `PATCH /api/todos/:id` in route registration (already handled in `features/todos/routes.ts`).

**Request body**
```json
{ "ids": [3, 1, 2] }
```

`ids` is the full ordered array of todo IDs, all integers. Position of each id is set to its index + 1.

**Response 200** `{ "ok": true }`  
**Response 400** `{ "error": "ids must be a non-empty array" }` — if ids is missing or empty; `{ "error": "ids must be a non-empty array of integers" }` — if an id is not an integer

---

## PATCH /api/todos/:id

Updates title and/or completed status of a todo. Fields not provided are left unchanged.

**Request body** (all fields optional)
```json
{ "title": "New title", "completed": true }
```

`completed` is a boolean, `0` or `1`. No body at all changes nothing and returns the todo.

**Response 200** — the updated todo object  
**Response 400** `{ "error": "title cannot be empty" }` — if title is explicitly set to blank; `{ "error": "title must be a string" }` or `{ "error": "completed must be a boolean, 0 or 1" }` — a wrong type  
**Response 404** `{ "error": "not found" }` — if id does not exist

---

## DELETE /api/todos/:id

Deletes a todo by id.

**Response 204** — no body  
**Response 404** `{ "error": "not found" }` — if id does not exist

---

## Other replies

- An unknown URL: **404** `{ "error": "not found" }`.
- A body that is not valid JSON: **400** `{ "error": "<Fastify's message>" }`.
- An unexpected failure: **500** `{ "error": "internal error" }`; the detail is in the server log only.
