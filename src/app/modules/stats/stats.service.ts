import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();

const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const getUserStats = async () => {
  const totalUsersPromise = User.countDocuments();
  const totalActivecUsersPromise = User.countDocuments({
    isActive: IsActive.ACTIVE,
  });
  const totalInActivecUsersPromise = User.countDocuments({
    isActive: IsActive.INACTIVE,
  });
  const totalBlockedUsersPromise = User.countDocuments({
    isActive: IsActive.BLOCKED,
  });
  const newUsersInLast7DaysPromise = User.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const newUsersInLast30DaysPromise = User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });
  const usersByRolePromise = User.aggregate([
    // stage-1 : Grouping users byu role and count total userrs in each role
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalUsers,
    totalActiveUsers,
    totalInActivecUsers,
    totalBlockedUsers,
    newUsersInLast7Days,
    newUsersInLast30Days,
    usersByRole,
    ,
  ] = await Promise.all([
    totalUsersPromise,
    totalActivecUsersPromise,
    totalInActivecUsersPromise,
    totalBlockedUsersPromise,
    newUsersInLast7DaysPromise,
    newUsersInLast30DaysPromise,
    usersByRolePromise,
    ,
  ]);
  return {
    totalUsers,
    totalActiveUsers,
    totalInActivecUsers,
    totalBlockedUsers,
    newUsersInLast7Days,
    newUsersInLast30Days,
    usersByRole,
  };
};
const getTourStats = async () => {
  const totalTourPromise = Tour.countDocuments();

  const totalTourByTourTypePromise = Tour.aggregate([
    // state-1 : connect Tour Type model - lookup stage
    {
      $lookup: {
        from: "tourtypes",
        localField: "tourType",
        foreignField: "_id",
        as: "type",
      },
    },
    // stage - 2 : unwind the array to object
    {
      $unwind: "$type",
    },
    // stage - 3 : grouping tour type
    {
      $group: {
        _id: "$type.name",
        count: { $sum: 1 },
      },
    },
  ]);
  const avgTourCostPromise = Tour.aggregate([
    // Stage-1: group the cost from, do sum, and average the sum
    {
      $group: {
        _id: null,
        avgCostForm: { $avg: "$costForm" },
      },
    },
    // // Stage-2: unwind the array to object
    // { $unwind: "$_id" },
  ]);
  const totalTourByDivisionPromise = Tour.aggregate([
    // state-1 : connect Division model - lookup stage
    {
      $lookup: {
        from: "divisions",
        localField: "division",
        foreignField: "_id",
        as: "division",
      },
    },
    // stage - 2 : unwind the array to object
    {
      $unwind: "$division",
    },
    // stage - 3 : grouping divisions
    {
      $group: {
        _id: "$division.name",
        count: { $sum: 1 },
      },
    },
  ]);
  const totalHighestBookedTourPromise = Booking.aggregate([
    // stage-1:Group the tour
    {
      $group: {
        _id: "$tour",
        bookingCount: { $sum: 1 },
      },
    },
    // stage-2:sort the tour
    {
      $sort: { bokingCount: -1 },
    },
    // stage-3 sort
    {
      $limit: 5,
    },
    // stage - 4 lookup stage
    {
      $lookup: {
        from: "tours",
        let: { tourId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$tourId"] },
            },
          },
        ],
        as: "tour",
      },
    },
    // stage - 5 unwind stage
    { $unwind: "$tour" },

    // stage - 6 project stage
    {
      $project: {
        bookingCount: 1,
        "tour.title": 1,
        "tour.slug": 1,
      },
    },
  ]);
  const [
    totalTour,
    totalTourByTourType,
    avgTourCost,
    totalTourByDivision,
    totalHighestBookedTour,
  ] = await Promise.all([
    totalTourPromise,
    totalTourByTourTypePromise,
    avgTourCostPromise,
    totalTourByDivisionPromise,
    totalHighestBookedTourPromise,
  ]);
  return {
    totalTour,
    totalTourByTourType,
    avgTourCost,
    totalTourByDivision,
    totalHighestBookedTour,
  };
};

const getBookingStats = async () => {
  const totalBokingPromise = Booking.countDocuments();
  const totalBookingByStatusPromise = Booking.aggregate([
    // stage-1: group stage
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const bookingPerTourPromise = Booking.aggregate([
    // stage-1: group stage
    {
      $group: {
        _id: "$tour",
        bookingCount: { $sum: 1 },
      },
    },
    // stage-2:sort stage
    {
      $sort: { bookingCount: -1 },
    },
    // stage-3:limit stage
    {
      $limit: 10,
    },
    // stage-4:lookup stage
    {
      $lookup: {
        from: "tours",
        localField: "_id",
        foreignField: "_id",
        as: "tour",
      },
    },
    // stage-4:unwind stage
    { $unwind: "$tour" },
    // stage-5:project stage
    {
      $project: {
        bookingCount: 1,
        _id: 1,
        "tour.title": 1,
        "tour.slug": 1,
      },
    },
  ]);

  const avgGuestCountPerBookingPromise = Booking.aggregate([
    // stage-1:group stage
    {
      $group: {
        _id: null,
        avgGuestCount: { $avg: "$guestCount" },
      },
    },
  ]);

  const bookingLast7DaysPromise = Booking.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const bookingLast30DaysPromise = Booking.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const totalBookingByUniqueUsersPromise = Booking.distinct("user").then(
    (bookings: any) => bookings.length
  );

  const [
    totalBoking,
    totalBookingByStatus,
    bookingPerTour,
    avgGuestCountPerBooking,
    bookingLast7Days,
    bookingLast30Days,
    totalBookingByUniqueUsers,
  ] = await Promise.all([
    totalBokingPromise,
    totalBookingByStatusPromise,
    bookingPerTourPromise,
    avgGuestCountPerBookingPromise,
    bookingLast7DaysPromise,
    bookingLast30DaysPromise,
    totalBookingByUniqueUsersPromise,
  ]);
  return {
    totalBoking,
    totalBookingByStatus,
    bookingPerTour,
    avgGuestCountPerBooking: avgGuestCountPerBooking[0].avgGuestCount,
    bookingLast7Days,
    bookingLast30Days,
    totalBookingByUniqueUsers,
  };
};
const getPaymentStats = async () => {
  const totalPaymentPromise = Payment.countDocuments();
  const totalPaymentByStatusPromise = Payment.aggregate([
    // stage 1 group
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
  const totalRevenuePromise = Payment.aggregate([
    // stage-1: match stage
    {
      $match: { status: PAYMENT_STATUS.PAID },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
      },
    },
  ]);

  const avgPaymentAmountPromise = Payment.aggregate([
    // stage 1 group stage
    {
      $group: {
        _id: null,
        avgPaymentAmount: { $avg: "$amount" },
      },
    },
  ]);

  const paymentGatewarDataPromise = Payment.aggregate([
    // stage-1: group stage
    {
      $group: {
        _id: { $ifNull: ["$paymentGatwayData.status", "UNKNOWN"] },
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalPayment,
    totalRevenue,
    totalPaymentByStatus,
    avgPaymentAmount,
    paymentGatewarData,
  ] = await Promise.all([
    totalPaymentPromise,
    totalRevenuePromise,
    totalPaymentByStatusPromise,
    avgPaymentAmountPromise,
    paymentGatewarDataPromise,
  ]);
  return {
    totalPayment,
    totalRevenue: totalRevenue ? totalRevenue[0].totalRevenue : 0,
    totalPaymentByStatus,
    avgPaymentAmount: avgPaymentAmount
      ? avgPaymentAmount[0].avgPaymentAmount
      : 0,
    paymentGatewarData,
  };
};

export const StatsService = {
  getBookingStats,
  getPaymentStats,
  getUserStats,
  getTourStats,
};

/**
 * //   await Tour.updateMany(
  //     {
  //       $or: [
  //         { tourType: { $type: "string" } },
  //         { division: { $type: "string" } },
  //       ],
  //     },
  //     [
  //       {
  //         $set: {
  //           tourType: { $toObjectId: "$tourType" },
  //           division: { $toObjectId: "$division" },
  //         },
  //       },
  //     ]
  //   );
 */
