import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { Event } from "./event.model";

// Booking interface for strong typing
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Booking schema definition
const BookingSchema = new Schema<IBooking>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    email: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v: string) => /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(v),
        message: "Invalid email format.",
      },
    },
  },
  {
    timestamps: true, // Auto-manage createdAt and updatedAt
    strict: true,
  },
);

// Index for eventId for faster queries
BookingSchema.index({ eventId: 1 });

// Pre-save hook to validate eventId reference and email
BookingSchema.pre<IBooking>("save", async function () {
  // Validate referenced event exists
  const eventExists = await Event.exists({ _id: this.eventId });
  if (!eventExists) {
    throw new Error("Referenced event does not exist.");
  }
  // Email format is validated by schema
});

// Export Booking model
export const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
