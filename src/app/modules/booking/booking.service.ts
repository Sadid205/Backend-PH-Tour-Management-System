import AppError from "../../errorHelpers/AppErrors";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import httpStatus from "http-status-codes";
import { Booking } from "./booking.model";
import { Tour } from "../tour/tour.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { SSLService } from "../../sslCommerz/sslCommerz.service";

const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

/**
 * Duplicate DB Collections / replica
 * Replica DB -> [Create Booking -> Create Payment -> Update Booking -> Error] -> Real DB
 */

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = getTransactionId();
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(userId);
    if (!user?.phone || !user.address) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Please Update Your Profile to Book a Tour"
      );
    }
    const tour = await Tour.findById(payload.tour).select("costForm");
    if (!tour?.costForm) {
      throw new AppError(httpStatus.BAD_REQUEST, "No Tour Cost Found!");
    }
    const amount = Number(tour.costForm) * Number(payload.guestCount!);
    const booking = await Booking.create(
      [
        {
          user: userId,
          status: BOOKING_STATUS.PENDING,
          ...payload,
        },
      ],
      { session }
    );
    const payment = await Payment.create(
      [
        {
          booking: booking[0]._id,
          status: PAYMENT_STATUS.UNPAID,
          transactionId: transactionId,
          amount: amount,
        },
      ],
      { session }
    );
    const updatedBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      {
        payment: payment[0]._id,
      },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costForm")
      .populate("payment");
    await session.commitTransaction(); // transaction
    const userAddress =
      // const sslPayload = {

      // }
      // const sslPayment = await SSLService.sslPaymentInit({
      //     address:updatedBooking?.user.address
      // })
      session.endSession();
    return updatedBooking;
  } catch (error) {
    await session.abortTransaction(); // rollback
    session.endSession();
    // throw new AppError(httpStatus.BAD_REQUEST,error) এইটা দেওয়া যাবে না  কারন আগে থেকেই এই error কাস্টমাইজ করা আছে ।
    throw error;
  }
};

// Frontend(localhost:5173) - User - Tour - Booking(Pending) - Payment(Unpaid) ->SSLCommerz Page -> Paynment Complete -> Backend(localhost:5000) -> Update Payment(PAID) & Booking(CONFIRM) -> redirect to frontend -> Frontend(localhost:5173/payment/success)
// Frontend(localhost:5173) - User - Tour - Booking(Pending) - Payment(Unpaid) ->SSLCommerz Page -> Paynment Fail/Cancle -> Backend(localhost:5000) -> Update Payment(FAIL/CANCEL) & Booking(FAIL/CANCEL) -> redirect to frontend -> Frontend(localhost:5173/payment/cancel or localhost:5173/payment/fail)

const getAllBookings = async () => {
  return {};
};
const getUserBookings = async () => {
  return {};
};
const getSingleBooking = async () => {
  return {};
};
const updateBookingStatus = async () => {
  return {};
};

export const BookingService = {
  createBooking,
  getAllBookings,
  getUserBookings,
  getSingleBooking,
  updateBookingStatus,
};
