const defaultActivities = [
  {
    id: 1,
    type: 'Running',
    durationMinutes: 35,
    intensity: 'High',
    date: '2026-07-03',
    points: 120,
  },
  {
    id: 2,
    type: 'Strength Training',
    durationMinutes: 45,
    intensity: 'Moderate',
    date: '2026-07-02',
    points: 140,
  },
  {
    id: 3,
    type: 'Walking',
    durationMinutes: 25,
    intensity: 'Low',
    date: '2026-07-01',
    points: 70,
  },
]

function intensityBadgeClass(intensity) {
  if (intensity === 'High') return 'text-bg-danger'
  if (intensity === 'Moderate') return 'text-bg-warning'
  return 'text-bg-success'
}

function Activities({ activities = defaultActivities, title = 'Recent Activities' }) {
  const totalPoints = activities.reduce((sum, activity) => sum + activity.points, 0)

  return (
    <section className="container py-4" aria-labelledby="activities-title">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <h2 id="activities-title" className="h4 mb-0">
          {title}
        </h2>
        <span className="badge text-bg-primary">Total points: {totalPoints}</span>
      </div>

      <div className="row g-3">
        {activities.map((activity) => (
          <article key={activity.id} className="col-12 col-md-6 col-xl-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                  <h3 className="h6 card-title mb-0">{activity.type}</h3>
                  <span className={`badge ${intensityBadgeClass(activity.intensity)}`}>
                    {activity.intensity}
                  </span>
                </div>
                <p className="card-text mb-1">
                  <strong>Duration:</strong> {activity.durationMinutes} minutes
                </p>
                <p className="card-text mb-1">
                  <strong>Date:</strong> {activity.date}
                </p>
                <p className="card-text mb-0">
                  <strong>Points:</strong> {activity.points}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Activities