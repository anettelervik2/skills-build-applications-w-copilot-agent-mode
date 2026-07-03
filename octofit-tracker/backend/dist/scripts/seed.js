"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../models");
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
    try {
        await mongoose_1.default.connect(connectionString);
        console.log('Seed the octofit_db database with test data');
        console.log('Connected to octofit_db');
        await Promise.all([
            models_1.Activity.deleteMany({}),
            models_1.Leaderboard.deleteMany({}),
            models_1.Team.deleteMany({}),
            models_1.User.deleteMany({}),
            models_1.Workout.deleteMany({}),
        ]);
        const users = await models_1.User.insertMany([
            {
                username: 'mona-octocat',
                name: 'Mona Octocat',
                email: 'mona.octocat@example.com',
                profile: { age: 29, fitnessGoal: 'Run a 10K', preferredWorkout: 'Outdoor cardio' },
                teamName: 'Blue Barracudas',
                points: 420,
            },
            {
                username: 'paul-octo',
                name: 'Paul Octo',
                email: 'paul.octo@example.com',
                profile: { age: 34, fitnessGoal: 'Build strength', preferredWorkout: 'Free weights' },
                teamName: 'Green Geckos',
                points: 510,
            },
            {
                username: 'nina-node',
                name: 'Nina Node',
                email: 'nina.node@example.com',
                profile: { age: 26, fitnessGoal: 'Improve mobility', preferredWorkout: 'Yoga flow' },
                teamName: 'Blue Barracudas',
                points: 360,
            },
            {
                username: 'devin-dash',
                name: 'Devin Dash',
                email: 'devin.dash@example.com',
                profile: { age: 31, fitnessGoal: 'Increase endurance', preferredWorkout: 'Cycling intervals' },
                teamName: 'Green Geckos',
                points: 390,
            },
        ]);
        const userByUsername = new Map(users.map((user) => [user.username, user]));
        await models_1.Team.insertMany([
            {
                name: 'Blue Barracudas',
                mascot: 'Barracuda',
                members: [userByUsername.get('mona-octocat')?._id, userByUsername.get('nina-node')?._id],
                weeklyGoalMinutes: 900,
            },
            {
                name: 'Green Geckos',
                mascot: 'Gecko',
                members: [userByUsername.get('paul-octo')?._id, userByUsername.get('devin-dash')?._id],
                weeklyGoalMinutes: 840,
            },
        ]);
        await models_1.Activity.insertMany([
            {
                user: userByUsername.get('mona-octocat')?._id,
                type: 'Running',
                durationMinutes: 38,
                caloriesBurned: 360,
                points: 95,
                completedAt: new Date('2026-07-01T13:30:00.000Z'),
            },
            {
                user: userByUsername.get('paul-octo')?._id,
                type: 'Strength Training',
                durationMinutes: 50,
                caloriesBurned: 420,
                points: 120,
                completedAt: new Date('2026-07-01T17:45:00.000Z'),
            },
            {
                user: userByUsername.get('nina-node')?._id,
                type: 'Yoga',
                durationMinutes: 45,
                caloriesBurned: 180,
                points: 80,
                completedAt: new Date('2026-07-02T07:15:00.000Z'),
            },
            {
                user: userByUsername.get('devin-dash')?._id,
                type: 'Cycling',
                durationMinutes: 42,
                caloriesBurned: 390,
                points: 105,
                completedAt: new Date('2026-07-02T12:10:00.000Z'),
            },
        ]);
        await models_1.Leaderboard.insertMany([...users]
            .sort((left, right) => right.points - left.points)
            .map((user, index) => ({
            user: user._id,
            teamName: user.teamName,
            rank: index + 1,
            points: user.points,
        })));
        await models_1.Workout.insertMany([
            {
                name: 'Starter 5K Builder',
                level: 'beginner',
                durationMinutes: 30,
                focusArea: 'Cardio endurance',
                suggestedForGoal: 'Run a 10K',
                exercises: ['Brisk warm-up walk', 'Run-walk intervals', 'Cool-down stretch'],
            },
            {
                name: 'Full Body Strength Circuit',
                level: 'intermediate',
                durationMinutes: 45,
                focusArea: 'Strength',
                suggestedForGoal: 'Build strength',
                exercises: ['Goblet squats', 'Dumbbell rows', 'Push-ups', 'Plank holds'],
            },
            {
                name: 'Morning Mobility Reset',
                level: 'beginner',
                durationMinutes: 20,
                focusArea: 'Mobility',
                suggestedForGoal: 'Improve mobility',
                exercises: ['Cat-cow', 'World greatest stretch', 'Hip airplanes', 'Thoracic rotations'],
            },
            {
                name: 'Hill Climb Intervals',
                level: 'advanced',
                durationMinutes: 40,
                focusArea: 'Cycling endurance',
                suggestedForGoal: 'Increase endurance',
                exercises: ['Cadence warm-up', 'Six hill repeats', 'Tempo finish', 'Recovery spin'],
            },
        ]);
        console.log('Database seeding complete');
        await mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
seedDatabase();
