import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const userSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", index: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: { type: String, default: null },

    passwordHash: { type: String, default: null, select: false },
    authProviders: { type: [String], default: [] }, // e.g. ["credentials", "google"]

    emailVerifiedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof userSchema>;

// Important: use bracket access to avoid TS producing an enormous union type for mongoose.models.*
const existing = (mongoose as unknown as { models?: Record<string, unknown> })
  .models?.User;
export const UserModel: Model<User> =
  (existing as Model<User>) || mongoose.model<User>("User", userSchema);
