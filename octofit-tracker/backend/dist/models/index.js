"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workout = exports.Leaderboard = exports.Activity = exports.Team = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    profile: {
        age: { type: Number, required: true },
        fitnessGoal: { type: String, required: true },
        preferredWorkout: { type: String, required: true },
    },
    teamName: { type: String, required: true },
    points: { type: Number, required: true, default: 0 },
}, { timestamps: true });
const teamSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    mascot: { type: String, required: true, trim: true },
    members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    weeklyGoalMinutes: { type: Number, required: true },
}, { timestamps: true });
const activitySchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    caloriesBurned: { type: Number, required: true },
    points: { type: Number, required: true },
    completedAt: { type: Date, required: true },
}, { timestamps: true });
const leaderboardSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    teamName: { type: String, required: true },
    rank: { type: Number, required: true },
    points: { type: Number, required: true },
}, { timestamps: true });
const workoutSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    level: { type: String, required: true, enum: ['beginner', 'intermediate', 'advanced'] },
    durationMinutes: { type: Number, required: true },
    focusArea: { type: String, required: true },
    suggestedForGoal: { type: String, required: true },
    exercises: [{ type: String, required: true }],
}, { timestamps: true });
exports.User = mongoose_1.default.models.User || mongoose_1.default.model('User', userSchema);
exports.Team = mongoose_1.default.models.Team || mongoose_1.default.model('Team', teamSchema);
exports.Activity = mongoose_1.default.models.Activity || mongoose_1.default.model('Activity', activitySchema);
exports.Leaderboard = mongoose_1.default.models.Leaderboard || mongoose_1.default.model('Leaderboard', leaderboardSchema);
exports.Workout = mongoose_1.default.models.Workout || mongoose_1.default.model('Workout', workoutSchema);
