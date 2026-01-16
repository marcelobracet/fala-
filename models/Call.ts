import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export type CallStatus = "completed" | "no_interest" | "unknown";

/**
 * Call record saved after Retell "after_call_end" webhook.
 * Keep it flexible: store raw payload for future fields without migrations.
 */
const callSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },

    // Optional: if we later associate calls to a user
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },

    provider: { type: String, default: "retell", index: true },
    providerCallId: { type: String, default: null, index: true },

    direction: { type: String, default: "inbound" }, // inbound/outbound in the future
    status: { type: String, default: "unknown" }, // CallStatus (kept as string to remain flexible)

    durationSeconds: { type: Number, default: 0 },
    transcript: { type: String, default: null },
    recordingUrl: { type: String, default: null },

    startedAt: { type: Date, default: null },
    endedAt: { type: Date, default: null },

    raw: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

export type Call = InferSchemaType<typeof callSchema>;

export const CallModel: Model<Call> = mongoose.models.Call
  ? (mongoose.models.Call as Model<Call>)
  : mongoose.model<Call>("Call", callSchema);


