import mongoose, { Document, Schema } from 'mongoose';

export interface IGoal extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  targetAmount: number;
  targetDate?: Date;
  priority: number; // 1 (highest) - 5 (lowest)
  savedAmount: number; // current amount allocated
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Goal name is required'],
      trim: true,
      maxlength: [120, 'Goal name cannot exceed 120 characters'],
    },
    targetAmount: {
      type: Number,
      required: true,
      min: [0, 'Target must be >= 0'],
    },
    targetDate: {
      type: Date,
    },
    priority: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 3,
      index: true,
    },
    savedAmount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Saved must be >= 0'],
    },
  },
  { timestamps: true }
);

GoalSchema.index({ userId: 1, priority: 1 });

export default mongoose.models.Goal || mongoose.model<IGoal>('Goal', GoalSchema);

