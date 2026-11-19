# literally-a-todo-app

A todo list, and nothing more: add tasks, tick them off, filter by All, Active and Completed, and reorder them by dragging or with the arrow buttons.

<p align="center">
  <img src="../docs/images/literally-a-todo-app.webp" width="100%" alt="The All tab on a wide screen: a header with the title and a Light, Dark and System theme switch, then a sheet with the Show filter, an add row and six household tasks on alternating pale green bands, two of them ticked and struck through, with drag, up, down and delete icons on the row under the pointer">
</p>

A React page talks to a small Fastify API that keeps the list in SQLite.

## Run it

```bash
cd backend && npm install && npm run dev      # the API on 127.0.0.1:3000
cd frontend && npm install && npm run dev     # http://localhost:5173
```

Run them in two terminals. The list is stored in `todos.db` in this folder. The API, the stack and the design rules are in the project's wiki, [docs/wiki/](docs/wiki/index.md).

## Check it

```bash
npm install                                    # once, in this folder: the lint and format tools
(cd frontend && npm install) && (cd backend && npm install)
npm run check                                  # typecheck, lint, format, tests and conventions for both projects
```

## License

MIT, see [LICENSE](LICENSE).
