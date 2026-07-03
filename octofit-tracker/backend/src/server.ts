import express from 'express';
import { connectDatabase } from './config/database';
import { Activity, Leaderboard, Team, User, Workout } from './models';

const app = express();
const port = 8000;
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', baseUrl });
});

app.get('/api/users', async (_req, res, next) => {
  try {
    const users = await User.find().sort({ name: 1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

app.get('/api/teams', async (_req, res, next) => {
  try {
    const teams = await Team.find().populate('members', 'username name points').sort({ name: 1 });
    res.json(teams);
  } catch (error) {
    next(error);
  }
});

app.get('/api/activities', async (_req, res, next) => {
  try {
    const activities = await Activity.find().populate('user', 'username name teamName').sort({ completedAt: -1 });
    res.json(activities);
  } catch (error) {
    next(error);
  }
});

app.get('/api/leaderboard', async (_req, res, next) => {
  try {
    const leaderboard = await Leaderboard.find().populate('user', 'username name').sort({ rank: 1 });
    res.json(leaderboard);
  } catch (error) {
    next(error);
  }
});

app.get('/api/workouts', async (_req, res, next) => {
  try {
    const workouts = await Workout.find().sort({ level: 1, name: 1 });
    res.json(workouts);
  } catch (error) {
    next(error);
  }
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = error instanceof Error ? error.message : String(error);
  res.status(500).json({ error: message });
});

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Octofit backend running at ${baseUrl}`);
    });
  })
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error connecting to octofit_db:', message);
    process.exit(1);
  });
