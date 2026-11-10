
import mongoose, { Schema, Document, Model } from 'mongoose';

export type AdminRole =
  | 'super_admin'
  | 'operations_manager'
  | 'support_lead'
  | 'branch_manager';

export interface IAdmin extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  branch: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: [
        'super_admin',
        'operations_manager',
        'support_lead',
        'branch_manager',
      ],
      default: 'branch_manager',
      required: true,
    },
    branch: {
      type: String,
      default: 'All Branches',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Admin: Model<IAdmin> =
  (mongoose.models.Admin as Model<IAdmin>) ||
  mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;

