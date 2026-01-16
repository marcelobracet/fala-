import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

/**
 * Company (tenant).
 *
 * MVP has a single plan, but we structure it to evolve later.
 */
const companySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },

    // Billing / limits (MVP default: 60 minutes included)
    minutesIncluded: { type: Number, default: 60 },
    minutesUsed: { type: Number, default: 0 },

    // Stripe references (prepared)
    stripeCustomerId: { type: String, default: null, index: true },

    // Retell references (prepared)
    retellAgentId: { type: String, default: null },
    inboundPhoneNumber: { type: String, default: null },

    timezone: { type: String, default: "America/Sao_Paulo" },
  },
  { timestamps: true }
);

export type Company = InferSchemaType<typeof companySchema>;

export const CompanyModel: Model<Company> = mongoose.models.Company
  ? (mongoose.models.Company as Model<Company>)
  : mongoose.model<Company>("Company", companySchema);


