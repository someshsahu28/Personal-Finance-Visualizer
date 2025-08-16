import mongoose, { Document, Schema } from 'mongoose';

export interface ITransfer extends Document {
  userId: mongoose.Types.ObjectId;
  fromAccountId: mongoose.Types.ObjectId;
  toAccountId: mongoose.Types.ObjectId;
  amount: number;
  date: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransferSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fromAccountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true, index: true },
    toAccountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true, index: true },
    amount: { type: Number, required: true, min: [0.01, 'Amount must be > 0'] },
    date: { type: Date, required: true, index: true },
    note: { type: String, trim: true, maxlength: 200 },
  },
  { timestamps: true }
);

TransferSchema.index({ userId: 1, date: -1 });

export default mongoose.models.Transfer ||
  mongoose.model<ITransfer>('Transfer', TransferSchema);

