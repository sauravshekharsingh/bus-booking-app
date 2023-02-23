import Bus from "../../models/bus.js";
import { createError } from "../../utils/error.js";

const COUPONS = [
  {
    code: "DEC2022",
    type: "percentage",
    value: 20,
  },
  {
    code: "BLACKFRIDAY",
    type: "amount",
    value: 200,
  },
];

export const verifyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;

    const coupon = COUPONS.find((coupon) => coupon.code === code);

    if (!coupon) {
      return next(createError(404, "Coupon code not found"));
    }

    return res.status(200).json({
      success: true,
      message: "Coupon fetched successfully",
      data: {
        coupon,
      },
    });
  } catch (err) {
    next(err);
  }
};
