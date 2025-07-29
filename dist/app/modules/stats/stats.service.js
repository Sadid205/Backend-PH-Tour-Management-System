"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
// no-sparse-arrays
// @typescript-eslint/no-explicit-any
const booking_model_1 = require("../booking/booking.model");
const payment_interface_1 = require("../payment/payment.interface");
const payment_model_1 = require("../payment/payment.model");
const tour_model_1 = require("../tour/tour.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const getUserStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsersPromise = user_model_1.User.countDocuments();
    const totalActivecUsersPromise = user_model_1.User.countDocuments({
        isActive: user_interface_1.IsActive.ACTIVE,
    });
    const totalInActivecUsersPromise = user_model_1.User.countDocuments({
        isActive: user_interface_1.IsActive.INACTIVE,
    });
    const totalBlockedUsersPromise = user_model_1.User.countDocuments({
        isActive: user_interface_1.IsActive.BLOCKED,
    });
    const newUsersInLast7DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
    });
    const newUsersInLast30DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
    });
    const usersByRolePromise = user_model_1.User.aggregate([
        // stage-1 : Grouping users byu role and count total userrs in each role
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 },
            },
        },
    ]);
    const [totalUsers, totalActiveUsers, totalInActivecUsers, totalBlockedUsers, newUsersInLast7Days, newUsersInLast30Days, usersByRole, ,] = yield Promise.all([
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
});
const getTourStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalTourPromise = tour_model_1.Tour.countDocuments();
    const totalTourByTourTypePromise = tour_model_1.Tour.aggregate([
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
    const avgTourCostPromise = tour_model_1.Tour.aggregate([
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
    const totalTourByDivisionPromise = tour_model_1.Tour.aggregate([
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
    const totalHighestBookedTourPromise = booking_model_1.Booking.aggregate([
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
    const [totalTour, totalTourByTourType, avgTourCost, totalTourByDivision, totalHighestBookedTour,] = yield Promise.all([
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
});
const getBookingStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalBokingPromise = booking_model_1.Booking.countDocuments();
    const totalBookingByStatusPromise = booking_model_1.Booking.aggregate([
        // stage-1: group stage
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);
    const bookingPerTourPromise = booking_model_1.Booking.aggregate([
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
    const avgGuestCountPerBookingPromise = booking_model_1.Booking.aggregate([
        // stage-1:group stage
        {
            $group: {
                _id: null,
                avgGuestCount: { $avg: "$guestCount" },
            },
        },
    ]);
    const bookingLast7DaysPromise = booking_model_1.Booking.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
    });
    const bookingLast30DaysPromise = booking_model_1.Booking.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
    });
    const totalBookingByUniqueUsersPromise = booking_model_1.Booking.distinct("user").then((bookings) => bookings.length);
    const [totalBoking, totalBookingByStatus, bookingPerTour, avgGuestCountPerBooking, bookingLast7Days, bookingLast30Days, totalBookingByUniqueUsers,] = yield Promise.all([
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
});
const getPaymentStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalPaymentPromise = payment_model_1.Payment.countDocuments();
    const totalPaymentByStatusPromise = payment_model_1.Payment.aggregate([
        // stage 1 group
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);
    const totalRevenuePromise = payment_model_1.Payment.aggregate([
        // stage-1: match stage
        {
            $match: { status: payment_interface_1.PAYMENT_STATUS.PAID },
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$amount" },
            },
        },
    ]);
    const avgPaymentAmountPromise = payment_model_1.Payment.aggregate([
        // stage 1 group stage
        {
            $group: {
                _id: null,
                avgPaymentAmount: { $avg: "$amount" },
            },
        },
    ]);
    const paymentGatewarDataPromise = payment_model_1.Payment.aggregate([
        // stage-1: group stage
        {
            $group: {
                _id: { $ifNull: ["$paymentGatwayData.status", "UNKNOWN"] },
                count: { $sum: 1 },
            },
        },
    ]);
    const [totalPayment, totalRevenue, totalPaymentByStatus, avgPaymentAmount, paymentGatewarData,] = yield Promise.all([
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
});
exports.StatsService = {
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
