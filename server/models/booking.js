import mongoose, { Schema, model } from "mongoose";

const bookingSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    seatNumbers: {
      type: [Number],
      required: true,
    },
    fare: {
      type: Number,
      required: true,
    },
    cancelled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = model("Booking", bookingSchema);

export default Booking;
