import { createError } from "../../utils/error.js";
import stripe from "stripe";
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

export const createPayment = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if(amount === 0) {
      return res.status(200).json({
        success: false,
        message: "Amount needs to be atleast greater than zero.",
      });  
    }

    const payment = await stripeInstance.paymentIntents.create({
      amount: amount,
      currency: "INR",
    });

    return res.status(200).json({
      success: true,
      message: "Ready for payment",
      data: {
        clientSecret: payment.client_secret,
      },
    });
  } catch (err) {
    next(err);
  }
};
