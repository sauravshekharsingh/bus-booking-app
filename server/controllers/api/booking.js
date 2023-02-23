import Booking from "../../models/booking.js";
import Bus from "../../models/bus.js";

import { getDateTimeFromDate, getDayFromDate } from "./../../utils/datetime.js";

export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("bus")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully.",
      data: {
        bookings,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getBusBookings = async (req, res, next) => {
  try {
    const { busId } = req.params;

    const bookings = await Booking.find({ bus: busId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully.",
      data: {
        bookings,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const search = async (req, res, next) => {
  try {
    const { from, to, date } = req.body;
    const day = getDayFromDate(date);

    let buses = await Bus.find({
      runsOnDays: { $in: [day] },
      $and: [{ busRoute: from }, { busRoute: to }],
    })
      .sort("fare")
      .lean();

    // Filter buses that have the from before to in route
    buses = buses.filter((bus) => {
      return bus.busRoute.indexOf(from) < bus.busRoute.indexOf(to);
    });

    for (let bus of buses) {
      const fromIndex = bus.busRoute.indexOf(from);
      const toIndex = bus.busRoute.indexOf(to);

      bus.from = bus.busRoute[fromIndex];
      bus.to = bus.busRoute[toIndex];

      bus.departure = bus.busRouteTimes[fromIndex];
      bus.arrival = bus.busRouteTimes[toIndex];

      bus.fare = bus.busRouteFares[toIndex] - bus.busRouteFares[fromIndex];

      const bookings = await Booking.find({
        bus: bus._id,
        date: getDateTimeFromDate(date),
      });

      bus.bookings = bookings;
    }

    return res.status(200).json({
      success: true,
      message: "Buses fetched successfully.",
      data: {
        buses,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const { busId, from, to, date, seatNumbers, fare } = req.body;

    const newBooking = new Booking({
      user: req.user.id,
      bus: busId,
      from,
      to,
      date: getDateTimeFromDate(date),
      seatNumbers,
      fare,
    });

    await newBooking.save();

    await Bus.findByIdAndUpdate(busId, {
      $push: { bookings: newBooking },
    });

    return res.status(200).json({
      success: true,
      message: "Booking created successfully.",
      data: {
        booking: newBooking,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const cancel = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        $set: { cancelled: true },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully.",
      data: {
        booking,
      },
    });
  } catch (err) {
    next(err);
  }
};
