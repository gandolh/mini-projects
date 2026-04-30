import type { FastifyInstance } from 'fastify'
import db from './db.js'

interface Todo {
  id: number
  title: string
  completed: number
  position: number
}

export async function todoRoutes(app: FastifyInstance) {
  // GET /api/todos
  app.get('/api/todos', async () => {
    return db.prepare('SELECT * FROM todos ORDER BY position ASC').all() as Todo[]
  })

  // POST /api/todos
  app.post<{ Body: { title?: string } }>('/api/todos', async (req, reply) => {
    const { title } = req.body
    if (!title || title.trim() === '') {
      return reply.status(400).send({ error: 'title is required' })
    }
    const maxRow = db.prepare('SELECT MAX(position) as maxPos FROM todos').get() as { maxPos: number | null }
    const position = (maxRow.maxPos ?? 0) + 1
    const result = db.prepare('INSERT INTO todos (title, completed, position) VALUES (?, 0, ?)').run(title.trim(), position)
    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid) as Todo
    return reply.status(201).send(todo)
  })

  // PATCH /api/todos/reorder — must be before /:id
  app.patch<{ Body: { ids?: number[] } }>('/api/todos/reorder', async (req, reply) => {
    const { ids } = req.body
    if (!Array.isArray(ids) || ids.length === 0) {
      return reply.status(400).send({ error: 'ids must be a non-empty array' })
    }
    const update = db.prepare('UPDATE todos SET position = ? WHERE id = ?')
    const reorder = db.transaction((ids: number[]) => {
      ids.forEach((id, index) => update.run(index + 1, id))
    })
    reorder(ids)
    return { ok: true }
  })

  // PATCH /api/todos/:id
  app.patch<{ Params: { id: string }; Body: { title?: string; completed?: boolean } }>(
    '/api/todos/:id',
    async (req, reply) => {
      const id = Number(req.params.id)
      const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id) as Todo | undefined
      if (!todo) return reply.status(404).send({ error: 'not found' })

      const title = req.body.title !== undefined ? req.body.title.trim() : todo.title
      const completed = req.body.completed !== undefined ? (req.body.completed ? 1 : 0) : todo.completed

      if (title === '') return reply.status(400).send({ error: 'title cannot be empty' })

      db.prepare('UPDATE todos SET title = ?, completed = ? WHERE id = ?').run(title, completed, id)
      return db.prepare('SELECT * FROM todos WHERE id = ?').get(id) as Todo
    }
  )

  // DELETE /api/todos/:id
  app.delete<{ Params: { id: string } }>('/api/todos/:id', async (req, reply) => {
    const id = Number(req.params.id)
    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id)
    if (!todo) return reply.status(404).send({ error: 'not found' })
    db.prepare('DELETE FROM todos WHERE id = ?').run(id)
    return reply.status(204).send()
  })
}
