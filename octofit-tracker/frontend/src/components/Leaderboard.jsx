const defaultLeaderboard = [
  {
    id: 1,
    name: 'Alex',
    team: 'Sharks',
    points: 920,
    workouts: 18,
  },
  {
    id: 2,
    name: 'Riley',
    team: 'Falcons',
    points: 870,
    workouts: 16,
  },
  {
    id: 3,
    name: 'Morgan',
    team: 'Sharks',
    points: 830,
    workouts: 15,
  },
  {
    id: 4,
    name: 'Jordan',
    team: 'Wolves',
    points: 790,
    workouts: 14,
  },
]

function Leaderboard({ entries = defaultLeaderboard, title = 'Leaderboard' }) {
  const rankedEntries = [...entries].sort((a, b) => b.points - a.points)

  return (
    <section className="container py-4" aria-labelledby="leaderboard-title">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <h2 id="leaderboard-title" className="h4 mb-0">
          {title}
        </h2>
        <span className="badge text-bg-dark">Top score: {rankedEntries[0]?.points ?? 0}</span>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Student</th>
              <th scope="col">Team</th>
              <th scope="col" className="text-end">
                Workouts
              </th>
              <th scope="col" className="text-end">
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {rankedEntries.map((entry, index) => (
              <tr key={entry.id}>
                <th scope="row">#{index + 1}</th>
                <td>{entry.name}</td>
                <td>{entry.team}</td>
                <td className="text-end">{entry.workouts}</td>
                <td className="text-end fw-semibold">{entry.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Leaderboard