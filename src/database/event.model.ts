import mongoose, { Document, Schema, Model } from "mongoose";

// Event interface for strong typing
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Event schema definition
const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: { type: [String], required: true },
    organizer: { type: String, required: true, trim: true },
    tags: { type: [String], required: true },
  },
  {
    timestamps: true, // Auto-manage createdAt and updatedAt
    strict: true,
  },
);

// Unique index for slug
EventSchema.index({ slug: 1 }, { unique: true });

// Pre-save hook for slug generation, date normalization, and validation
EventSchema.pre<IEvent>("save", function () {
  // Generate slug only if title changed
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  // Normalize date to ISO format
  if (this.isModified("date")) {
    const parsedDate = new Date(this.date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date format.");
    }
    this.date = parsedDate.toISOString().split("T")[0];
  }

  // Normalize time to HH:MM (24h) format
  if (this.isModified("time")) {
    const timeMatch = this.time.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
    if (!timeMatch) {
      throw new Error("Time must be in HH:MM 24-hour format.");
    }
    this.time = `${timeMatch[1].padStart(2, "0")}:${timeMatch[2]}`;
  }

  // Validate required string fields are non-empty
  const requiredFields: (keyof IEvent)[] = [
    "title",
    "description",
    "overview",
    "image",
    "venue",
    "location",
    "date",
    "time",
    "mode",
    "audience",
    "organizer",
  ];
  for (const field of requiredFields) {
    if (!this[field] || (typeof this[field] === "string" && !this[field].trim())) {
      throw new Error(`${field} is required and cannot be empty.`);
    }
  }
  // Validate agenda and tags arrays
  if (!Array.isArray(this.agenda) || this.agenda.length === 0) {
    throw new Error("Agenda is required and cannot be empty.");
  }
  if (!Array.isArray(this.tags) || this.tags.length === 0) {
    throw new Error("Tags are required and cannot be empty.");
  }
});

// Export Event model
export const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
