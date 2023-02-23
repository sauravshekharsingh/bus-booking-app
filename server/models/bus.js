import mongoose, { Schema, model } from "mongoose";

const busSchema = new Schema(
  {
    busName: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    contactNumber: {
      type: String,
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
    busRoute: {
      type: [String],
      required: true,
    },
    busRouteTimes: {
      type: [Date],
      required: true,
    },
    busRouteFares: {
      type: [Number],
      required: true,
    },
    numOfSeats: {
      type: Number,
      required: true,
    },
    runsOnDays: {
      type: [String],
      required: true,
    },
    departure: {
      type: Date,
      required: true,
    },
    arrival: {
      type: Date,
      required: true,
    },
    facilities: {
      type: [String],
    },
    fare: {
      type: Number,
      required: true,
    },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    reviews: [
      {
        rating: {
          type: Number,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Bus = model("Bus", busSchema);

export default Bus;
