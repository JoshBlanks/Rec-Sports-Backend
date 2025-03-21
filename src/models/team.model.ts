import mongoose, { Document, Schema } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  sportId: mongoose.Types.ObjectId;
  divisionId: mongoose.Types.ObjectId;
  captainId: mongoose.Types.ObjectId;
  logo?: string;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    sportId: {
      type: Schema.Types.ObjectId,
      ref: 'Sport',
      required: true
    },
    divisionId: {
      type: Schema.Types.ObjectId,
      ref: 'Division',
      required: true
    },
    captainId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    logo: {
      type: String
    },
    wins: {
      type: Number,
      default: 0
    },
    losses: {
      type: Number,
      default: 0
    },
    draws: {
      type: Number,
      default: 0
    },
    points: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ITeam>('Team', TeamSchema);