# OctoFit Frontend

## Environment variables

Define `VITE_CODESPACE_NAME` when running in Codespaces so API requests resolve to the backend URL.

Example `.env.local`:

```bash
VITE_CODESPACE_NAME=your-codespace-name
```

The app builds API endpoints in this form:

```text
https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api/[component]/
```

If `VITE_CODESPACE_NAME` is not set, the frontend safely falls back to:

- Derived `-8000.app.github.dev` host when running on GitHub Codespaces preview
- `http://localhost:8000/api` for local development

This prevents invalid URLs such as `https://undefined-8000.app.github.dev/...`.
