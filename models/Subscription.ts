import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export type SubscriptionStatus =
  | "incomplete"
  | "incomplete_expired"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "paused"
  | "unknown";

/**
 * Subscription (Stripe recurring).
 *
 * MVP:
 * - Single plan: Basic
 * - R$97/month
 * - 60 minutes included
 * - Overage: R$2,50/min
 */
const subscriptionSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, unique: true, index: true },

    plan: { type: String, default: "basic" },
    currency: { type: String, default: "brl" },

    priceCents: { type: Number, default: 9700 },
    includedMinutes: { type: Number, default: 60 },
    overageCentsPerMinute: { type: Number, default: 250 },

    stripeCustomerId: { type: String, default: null, index: true },
    stripeSubscriptionId: { type: String, default: null, index: true },

    status: { type: String, default: "unknown" }, // SubscriptionStatus as string
    currentPeriodStart: { type: Date, default: null },
    currentPeriodEnd: { type: Date, default: null },
    cancelAtPeriodEnd: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type Subscription = InferSchemaType<typeof subscriptionSchema>;

export const SubscriptionModel: Model<Subscription> = mongoose.models.Subscription
  ? (mongoose.models.Subscription as Model<Subscription>)
  : mongoose.model<Subscription>("Subscription", subscriptionSchema);


