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

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [count, setCount] = useState(0)
  const [next, setNext] = useState(null)
  const [previous, setPrevious] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const endpoint = useMemo(() => {
    const codespaceEndpoint = `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
    return import.meta.env.VITE_CODESPACE_NAME
      ? codespaceEndpoint
      : `${resolveApiBaseUrl()}/api/workouts/`
  }, [])

  useEffect(() => {
    let isMounted = true

    async function fetchWorkouts() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(endpoint)

        if (!response.ok) {
          throw new Error(`Failed to load workouts: ${response.status}`)
        }

        const payload = await response.json()
        const normalized = normalizeListPayload(payload)

        if (isMounted) {
          setWorkouts(normalized.items)
          setCount(normalized.count)
          setNext(normalized.next)
          setPrevious(normalized.previous)
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load workouts')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchWorkouts()

    return () => {
      isMounted = false
    }
  }, [endpoint])

  return (
    <section className="py-2" aria-labelledby="workouts-title">
      <div className="d-flex align-items-center justify-content-between mb-3 gap-2 flex-wrap">
        <h2 id="workouts-title" className="h4 mb-0">
          Workouts
        </h2>
        <span className="badge text-bg-secondary">{count} total</span>
      </div>

      {loading && <p className="text-secondary">Loading workouts...</p>}
      {error && <div className="alert alert-danger mb-3">{error}</div>}

      {!loading && !error && (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Duration (min)</th>
                  <th scope="col">Intensity</th>
                  <th scope="col">Points</th>
                </tr>
              </thead>
              <tbody>
                {workouts.map((workout, index) => (
                  <tr key={workout.id ?? workout._id ?? `${workout.type ?? 'workout'}-${index}`}>
                    <td>{workout.type ?? workout.name ?? 'Workout'}</td>
                    <td>{workout.durationMinutes ?? workout.duration ?? '-'}</td>
                    <td>{workout.intensity ?? '-'}</td>
                    <td>{workout.points ?? 0}</td>
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

export default Workouts