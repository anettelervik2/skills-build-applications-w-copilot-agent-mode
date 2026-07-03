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

function intensityBadgeClass(intensity) {
  if (intensity === 'High') return 'text-bg-danger'
  if (intensity === 'Moderate') return 'text-bg-warning'
  return 'text-bg-success'
}

function Activities() {
  const [activities, setActivities] = useState([])
  const [count, setCount] = useState(0)
  const [next, setNext] = useState(null)
  const [previous, setPrevious] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const endpoint = useMemo(() => `${resolveApiBaseUrl()}/api/activities/`, [])

  useEffect(() => {
    let isMounted = true

    async function fetchActivities() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(endpoint)

        if (!response.ok) {
          throw new Error(`Failed to load activities: ${response.status}`)
        }

        const payload = await response.json()
        const normalized = normalizeListPayload(payload)

        if (isMounted) {
          setActivities(normalized.items)
          setCount(normalized.count)
          setNext(normalized.next)
          setPrevious(normalized.previous)
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError instanceof Error ? requestError.message : 'Unable to load activities',
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchActivities()

    return () => {
      isMounted = false
    }
  }, [endpoint])

  const totalPoints = activities.reduce((sum, activity) => sum + (activity.points ?? 0), 0)

  return (
    <section className="container py-4" aria-labelledby="activities-title">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <h2 id="activities-title" className="h4 mb-0">
          Activities
        </h2>
        <span className="badge text-bg-primary">{count} total | points {totalPoints}</span>
      </div>

      {loading && <p className="text-secondary">Loading activities...</p>}
      {error && <div className="alert alert-danger mb-3">{error}</div>}

      {!loading && !error && (
        <>
          <div className="row g-3">
            {activities.map((activity, index) => (
              <article
                key={activity.id ?? activity._id ?? `${activity.type ?? 'activity'}-${index}`}
                className="col-12 col-md-6 col-xl-4"
              >
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                      <h3 className="h6 card-title mb-0">{activity.type ?? 'Activity'}</h3>
                      <span className={`badge ${intensityBadgeClass(activity.intensity)}`}>
                        {activity.intensity ?? 'Moderate'}
                      </span>
                    </div>
                    <p className="card-text mb-1">
                      <strong>User:</strong>{' '}
                      {activity.user?.name ?? activity.user?.username ?? activity.user ?? '-'}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Duration:</strong> {activity.durationMinutes ?? '-'} minutes
                    </p>
                    <p className="card-text mb-1">
                      <strong>Date:</strong>{' '}
                      {activity.completedAt
                        ? new Date(activity.completedAt).toLocaleDateString()
                        : activity.date ?? '-'}
                    </p>
                    <p className="card-text mb-0">
                      <strong>Points:</strong> {activity.points ?? 0}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="small text-secondary mt-3 mb-0">
            Pagination: prev {previous ? 'available' : 'none'} | next {next ? 'available' : 'none'}
          </p>
        </>
      )}
    </section>
  )
}

export default Activities