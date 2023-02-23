import Bus from "../../models/bus.js";

import { getDateTimeFromTime } from "./../../utils/datetime.js";

export const getBuses = async (req, res, next) => {
  try {
    const buses = await Bus.find({ user: req.user.id });

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

export const addBus = async (req, res, next) => {
  try {
    const {
      busName,
      contactNumber,
      from,
      to,
      busRoute,
      busRouteTimes,
      busRouteFares,
      numOfSeats,
      runsOnDays,
      departure,
      arrival,
      facilities,
      fare,
    } = req.body;

    const newBus = new Bus({
      busName,
      contactNumber,
      from,
      to,
      busRoute,
      busRouteTimes: busRouteTimes.map((time) => getDateTimeFromTime(time)),
      busRouteFares,
      numOfSeats,
      runsOnDays,
      departure: getDateTimeFromTime(departure),
      arrival: getDateTimeFromTime(arrival),
      facilities,
      fare,
      user: req.user.id,
    });

    await newBus.save();

    return res.status(200).json({
      success: true,
      message: "Bus added successfully.",
      data: {
        bus: newBus,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const removeBus = async (req, res, next) => {
  try {
    const { busId } = req.params;

    const bus = await Bus.findByIdAndDelete(busId);

    return res.status(200).json({
      success: true,
      message: "Bus removed successfully.",
      data: {
        bus,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const { busId } = req.params;
    const { rating, content } = req.body;

    const review = {
      rating,
      content,
    };

    const bus = await Bus.findByIdAndUpdate(
      busId,
      {
        $push: { reviews: review },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Review added successfully.",
      data: {
        bus,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getReview = async (req, res, next) => {
  try {
    const { busId } = req.params;

    const bus = await Bus.findById(busId).select("reviews");

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully.",
      data: {
        bus,
      },
    });
  } catch (err) {
    next(err);
  }
};
