import mongoose, { InferSchemaType, Schema } from 'mongoose';

const userSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

const teamSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    mascot: { type: String, required: true, trim: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    weeklyGoalMinutes: { type: Number, required: true },
  },
  { timestamps: true }
);

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    caloriesBurned: { type: Number, required: true },
    points: { type: Number, required: true },
    completedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const leaderboardSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    teamName: { type: String, required: true },
    rank: { type: Number, required: true },
    points: { type: Number, required: true },
  },
  { timestamps: true }
);

const workoutSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    level: { type: String, required: true, enum: ['beginner', 'intermediate', 'advanced'] },
    durationMinutes: { type: Number, required: true },
    focusArea: { type: String, required: true },
    suggestedForGoal: { type: String, required: true },
    exercises: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export type UserDocument = InferSchemaType<typeof userSchema>;
export type TeamDocument = InferSchemaType<typeof teamSchema>;
export type ActivityDocument = InferSchemaType<typeof activitySchema>;
export type LeaderboardDocument = InferSchemaType<typeof leaderboardSchema>;
export type WorkoutDocument = InferSchemaType<typeof workoutSchema>;

export const User = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);
export const Team = mongoose.models.Team || mongoose.model<TeamDocument>('Team', teamSchema);
export const Activity = mongoose.models.Activity || mongoose.model<ActivityDocument>('Activity', activitySchema);
export const Leaderboard =
  mongoose.models.Leaderboard || mongoose.model<LeaderboardDocument>('Leaderboard', leaderboardSchema);
export const Workout = mongoose.models.Workout || mongoose.model<WorkoutDocument>('Workout', workoutSchema);