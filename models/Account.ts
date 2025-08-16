import mongoose, { Document, Schema } from 'mongoose';

export type AccountType = 'checking' | 'savings' | 'credit';

export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  type: AccountType;
  openingBalance: number;
  lowBalanceThreshold?: number;
  currency: string; // e.g., 'INR'
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Account name is required'],
      trim: true,
      maxlength: [100, 'Account name cannot exceed 100 characters'],
    },
    type: {
      type: String,
      enum: ['checking', 'savings', 'credit'],
      required: [true, 'Account type is required'],
    },
    openingBalance: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Opening balance cannot be negative'],
    },
    lowBalanceThreshold: {
      type: Number,
      required: false,
      default: 0,
      min: [0, 'Threshold cannot be negative'],
    },
    currency: {
      type: String,
      required: true,
      default: 'INR',
    },
  },
  { timestamps: true }
);

AccountSchema.index({ userId: 1, name: 1 }, { unique: false });

export default mongoose.models.Account ||
  mongoose.model<IAccount>('Account', AccountSchema);

