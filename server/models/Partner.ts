
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPartner extends Document {
  partnerId: string;
  legalName: string;
  mobileNumber: string;
  email?: string;
  dob?: string;
  address: string;
  serviceArea: string;
  emergencyContact?: string;
  categoryIds: string[];
  aadhaarMasked: string;
  aadhaarName: string;
  panMasked: string;
  panName: string;
  livePhotoRef?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  aadhaarStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  panStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  photoStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  isOnline: boolean;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
  updatedAt: Date;
}

const PartnerSchema = new Schema<IPartner>(
  {
    partnerId: { type: String, required: true, unique: true, index: true },
    legalName: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true, unique: true, index: true },
    email: { type: String, trim: true, lowercase: true },
    dob: String,
    address: { type: String, required: true },
    serviceArea: { type: String, required: true },
    emergencyContact: String,
    categoryIds: { type: [String], default: [] },
    aadhaarMasked: { type: String, required: true },
    aadhaarName: { type: String, required: true },
    panMasked: { type: String, required: true },
    panName: { type: String, required: true },
    livePhotoRef: String,
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'],
      default: 'PENDING',
    },
    aadhaarStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
    },
    panStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
    },
    photoStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
    },
    isOnline: { type: Boolean, default: false },
    latitude: Number,
    longitude: Number,
  },
  { timestamps: true, versionKey: false }
);

const Partner: Model<IPartner> =
  (mongoose.models.Partner as Model<IPartner>) ||
  mongoose.model<IPartner>('Partner', PartnerSchema);

export default Partner;
