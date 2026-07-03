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

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [count, setCount] = useState(0)
  const [next, setNext] = useState(null)
  const [previous, setPrevious] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const endpoint = useMemo(() => `${resolveApiBaseUrl()}/api/leaderboard/`, [])

  useEffect(() => {
    let isMounted = true

    async function fetchLeaderboard() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(endpoint)

        if (!response.ok) {
          throw new Error(`Failed to load leaderboard: ${response.status}`)
        }

        const payload = await response.json()
        const normalized = normalizeListPayload(payload)

        if (isMounted) {
          setEntries(normalized.items)
          setCount(normalized.count)
          setNext(normalized.next)
          setPrevious(normalized.previous)
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError instanceof Error ? requestError.message : 'Unable to load leaderboard',
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchLeaderboard()

    return () => {
      isMounted = false
    }
  }, [endpoint])

  const rankedEntries = [...entries].sort((a, b) => (b.points ?? 0) - (a.points ?? 0))

  return (
    <section className="container py-4" aria-labelledby="leaderboard-title">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <h2 id="leaderboard-title" className="h4 mb-0">
          Leaderboard
        </h2>
        <span className="badge text-bg-dark">{count} total | top {rankedEntries[0]?.points ?? 0}</span>
      </div>

      {loading && <p className="text-secondary">Loading leaderboard...</p>}
      {error && <div className="alert alert-danger mb-3">{error}</div>}

      {!loading && !error && (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">Student</th>
                  <th scope="col">Team</th>
                  <th scope="col" className="text-end">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {rankedEntries.map((entry, index) => (
                  <tr key={entry.id ?? entry._id ?? `${entry.user?.username ?? 'entry'}-${index}`}>
                    <th scope="row">#{entry.rank ?? index + 1}</th>
                    <td>{entry.user?.name ?? entry.user?.username ?? entry.name ?? 'Unknown user'}</td>
                    <td>{entry.teamName ?? entry.team ?? '-'}</td>
                    <td className="text-end fw-semibold">{entry.points ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="small text-secondary mt-3 mb-0">
            Pagination: prev {previous ? 'available' : 'none'} | next {next ? 'available' : 'none'}
          </p>
        </>
      )}
    </section>
  )
}

export default Leaderboard