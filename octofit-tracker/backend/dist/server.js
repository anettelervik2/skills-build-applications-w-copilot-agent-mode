"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./config/database");
const models_1 = require("./models");
const app = (0, express_1.default)();
const port = 8000;
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
const allowedFrontendOriginPattern = /^https:\/\/[a-z0-9-]+-5173\.app\.github\.dev$/;
const corsOptions = {
    origin(origin, callback) {
        if (!origin) {
            callback(null, true);
            return;
        }
        if (origin === 'http://localhost:5173' || allowedFrontendOriginPattern.test(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error('Origin not allowed by CORS'));
    },
};
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', baseUrl });
});
app.get('/api/users', async (_req, res, next) => {
    try {
        const users = await models_1.User.find().sort({ name: 1 });
        res.json(users);
    }
    catch (error) {
        next(error);
    }
});
app.get('/api/teams', async (_req, res, next) => {
    try {
        const teams = await models_1.Team.find().populate('members', 'username name points').sort({ name: 1 });
        res.json(teams);
    }
    catch (error) {
        next(error);
    }
});
app.get('/api/activities', async (_req, res, next) => {
    try {
        const activities = await models_1.Activity.find().populate('user', 'username name teamName').sort({ completedAt: -1 });
        res.json(activities);
    }
    catch (error) {
        next(error);
    }
});
app.get('/api/leaderboard', async (_req, res, next) => {
    try {
        const leaderboard = await models_1.Leaderboard.find().populate('user', 'username name').sort({ rank: 1 });
        res.json(leaderboard);
    }
    catch (error) {
        next(error);
    }
});
app.get('/api/workouts', async (_req, res, next) => {
    try {
        const workouts = await models_1.Workout.find().sort({ level: 1, name: 1 });
        res.json(workouts);
    }
    catch (error) {
        next(error);
    }
});
app.use((error, _req, res, _next) => {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: message });
});
(0, database_1.connectDatabase)()
    .then(() => {
    app.listen(port, () => {
        console.log(`Octofit backend running at ${baseUrl}`);
    });
})
    .catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error connecting to octofit_db:', message);
    process.exit(1);
});
