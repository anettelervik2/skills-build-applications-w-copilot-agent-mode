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

function Teams() {
  const [teams, setTeams] = useState([])
  const [count, setCount] = useState(0)
  const [next, setNext] = useState(null)
  const [previous, setPrevious] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const endpoint = useMemo(() => `${resolveApiBaseUrl()}/api/teams/`, [])

  useEffect(() => {
    let isMounted = true

    async function fetchTeams() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(endpoint)

        if (!response.ok) {
          throw new Error(`Failed to load teams: ${response.status}`)
        }

        const payload = await response.json()
        const normalized = normalizeListPayload(payload)

        if (isMounted) {
          setTeams(normalized.items)
          setCount(normalized.count)
          setNext(normalized.next)
          setPrevious(normalized.previous)
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load teams')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchTeams()

    return () => {
      isMounted = false
    }
  }, [endpoint])

  return (
    <section className="py-2" aria-labelledby="teams-title">
      <div className="d-flex align-items-center justify-content-between mb-3 gap-2 flex-wrap">
        <h2 id="teams-title" className="h4 mb-0">
          Teams
        </h2>
        <span className="badge text-bg-secondary">{count} total</span>
      </div>

      {loading && <p className="text-secondary">Loading teams...</p>}
      {error && <div className="alert alert-danger mb-3">{error}</div>}

      {!loading && !error && (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Members</th>
                  <th scope="col">Points</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, index) => (
                  <tr key={team.id ?? team._id ?? `${team.name ?? 'team'}-${index}`}>
                    <td>{team.name ?? 'Unknown team'}</td>
                    <td>{team.memberCount ?? team.members?.length ?? '-'}</td>
                    <td>{team.points ?? 0}</td>
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

export default Teams