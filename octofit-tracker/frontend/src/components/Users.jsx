import { useEffect, useMemo, useState } from 'react'

function resolveApiBaseUrl() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev`
  }

  if (window.location.hostname.includes('github.dev')) {
    const host = window.location.hostname.replace('-5173.app.github.dev', '-8000.app.github.dev')
    return `https://${host}`
  }

  return 'http://localhost:8000'
}

function normalizeListPayload(payload) {
  if (Array.isArray(payload)) {
    return { items: payload, count: payload.length, next: null, previous: null }
  }

  const items =
    (Array.isArray(payload?.results) && payload.results) ||
    (Array.isArray(payload?.items) && payload.items) ||
    (Array.isArray(payload?.data) && payload.data) ||
    []

  return {
    items,
    count: Number.isFinite(payload?.count) ? payload.count : items.length,
    next: payload?.next ?? null,
    previous: payload?.previous ?? null,
  }
}

function Users() {
  const [users, setUsers] = useState([])
  const [count, setCount] = useState(0)
  const [next, setNext] = useState(null)
  const [previous, setPrevious] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const endpoint = useMemo(() => {
    const codespaceEndpoint = `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/users/`
    return import.meta.env.VITE_CODESPACE_NAME
      ? codespaceEndpoint
      : `${resolveApiBaseUrl()}/api/users/`
  }, [])

  useEffect(() => {
    let isMounted = true

    async function fetchUsers() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(endpoint)

        if (!response.ok) {
          throw new Error(`Failed to load users: ${response.status}`)
        }

        const payload = await response.json()
        const normalized = normalizeListPayload(payload)

        if (isMounted) {
          setUsers(normalized.items)
          setCount(normalized.count)
          setNext(normalized.next)
          setPrevious(normalized.previous)
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load users')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchUsers()

    return () => {
      isMounted = false
    }
  }, [endpoint])

  return (
    <section className="py-2" aria-labelledby="users-title">
      <div className="d-flex align-items-center justify-content-between mb-3 gap-2 flex-wrap">
        <h2 id="users-title" className="h4 mb-0">
          Users
        </h2>
        <span className="badge text-bg-secondary">{count} total</span>
      </div>

      {loading && <p className="text-secondary">Loading users...</p>}
      {error && <div className="alert alert-danger mb-3">{error}</div>}

      {!loading && !error && (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id ?? user._id ?? `${user.email ?? 'user'}-${index}`}>
                    <td>{user.name ?? user.username ?? 'Unknown user'}</td>
                    <td>{user.email ?? '-'}</td>
                    <td>{user.role ?? 'member'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="small text-secondary mb-0">
            Pagination: prev {previous ? 'available' : 'none'} | next {next ? 'available' : 'none'}
          </p>
        </>
      )}
    </section>
  )
}

export default Users