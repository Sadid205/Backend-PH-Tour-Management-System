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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourServices = exports.TourTypeServices = void 0;
// @typescript-eslint/no-non-null-assertion
const AppErrors_1 = __importDefault(require("../../errorHelpers/AppErrors"));
// import { TourType } from "./TourType.model";
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const tour_model_1 = require("./tour.model");
const division_model_1 = require("../division/division.model");
const tour_constant_1 = require("./tour.constant");
const queryBuilder_1 = require("../../utils/queryBuilder");
const cloudinary_config_1 = require("../../config/cloudinary.config");
// Tour Type Services
const getAllTourType = () => __awaiter(void 0, void 0, void 0, function* () {
    const TourTypes = yield tour_model_1.TourType.find({});
    return TourTypes;
});
const createTourType = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isTourTypeExist = yield tour_model_1.TourType.findOne({ name: payload.name });
    if (isTourTypeExist) {
        throw new AppErrors_1.default(http_status_codes_1.default.BAD_REQUEST, "TourType Already Exist");
    }
    const newTourType = yield tour_model_1.TourType.create(Object.assign({}, payload));
    return newTourType;
});
const updateTourType = (payload, tourTypeId) => __awaiter(void 0, void 0, void 0, function* () {
    const isTourTypeExist = yield tour_model_1.TourType.findById(tourTypeId);
    if (!isTourTypeExist) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, "TourType Not Found");
    }
    const updatedTourType = yield tour_model_1.TourType.findByIdAndUpdate(tourTypeId, payload, {
        new: true,
    });
    return updatedTourType;
});
const deleteTourType = (tourTypeId) => __awaiter(void 0, void 0, void 0, function* () {
    const isTourTypeExist = yield tour_model_1.TourType.findById(tourTypeId);
    if (!isTourTypeExist) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, "TourType Not Found");
    }
    yield tour_model_1.TourType.findByIdAndDelete(tourTypeId);
});
// Tour Services
// const oldgetAllTour = async (query: Record<string, string>) => {
//   const searchTerm = query.searchTerm || "";
//   const filter = { ...query };
//   const sort = query.sort || "-createdAt";
//   const page = Number(query.page) || 1;
//   const limit = Number(query.limit) || 10;
//   const skip = (page - 1) * limit;
//   // field filtering
//   const fields = query.fields?.split(",").join(" ") || "";
//   console.log(fields);
//   for (const field of excludeField) {
//     delete filter[field];
//     console.log(field);
//   }
//   const searchQuery = {
//     //title: { $regex: searchTerm, $options: "i" },
//     $or: tourSearchableFields.map((field) => ({
//       [field]: { $regex: searchTerm, $options: "i" },
//     })),
//   };
// // skip = (page -1) * 10 = 30
// // ?page=3&limit=10
// // const tours = await Tour.find(searchQuery)
// //   .find(filter)
// //   .sort(sort)
// //   .select(fields)
// //   .skip(skip)
// //   .limit(limit);
// // cosnt allTours =  new Querybuilder(Tour.find(),query)
// const filterQuery = Tour.find(filter);
// const tours = filterQuery.find(searchQuery);
// const allTours = await tours
//   .sort(sort)
//   .select(fields)
//   .skip(skip)
//   .limit(limit);
// const totalTours = await Tour.countDocuments();
// console.log(filter);
// // location = Dhaka
// // search = Golf
// const totalPage = Math.ceil(totalTours / limit);
// const meta = {
//   page: page,
//   limit: limit,
//   total: totalTours,
//   totalPage: totalPage,
// };
// return {
//   data: allTours,
//   meta: meta,
// };
// };
const getAllTour = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new queryBuilder_1.QueryBuilder(tour_model_1.Tour.find(), query);
    const tours = queryBuilder
        .search(tour_constant_1.tourSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    // const meta = await queryBuilder.getMeta();
    const [data, meta] = yield Promise.all([
        tours.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const createTour = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, division, tourType } = payload, rest = __rest(payload, ["title", "division", "tourType"]);
    const isTourTypeExist = yield tour_model_1.TourType.findById(tourType);
    if (!isTourTypeExist) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, "Tour Type Not Found");
    }
    const isDivisionExist = yield division_model_1.Division.findById(division);
    if (!isDivisionExist) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, "Division Type Not Found");
    }
    const isTourExist = yield tour_model_1.Tour.findOne({ title: title });
    if (isTourExist) {
        throw new AppErrors_1.default(http_status_codes_1.default.BAD_REQUEST, "Tour Already Exist");
    }
    const tour = yield tour_model_1.Tour.create(Object.assign({ title,
        division,
        tourType }, rest));
    return tour;
});
const updateTour = (payload, tourId) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedPayload = Object.assign({}, payload);
    if (updatedPayload.division) {
        const isDivisionExist = yield division_model_1.Division.findById(updatedPayload.division);
        if (!isDivisionExist) {
            throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, "Division Type Not Found");
        }
    }
    if (updatedPayload.tourType) {
        const isTourTypeExist = yield tour_model_1.TourType.findById(updatedPayload.tourType);
        if (!isTourTypeExist) {
            throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, "Tour Type Not Found");
        }
    }
    const isTourExist = yield tour_model_1.Tour.findById(tourId);
    if (!isTourExist) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, "Tour Not Found");
    }
    if (updatedPayload.images &&
        updatedPayload.images.length > 0 &&
        isTourExist.images &&
        isTourExist.images.length > 0) {
        updatedPayload.images = [...updatedPayload.images, ...isTourExist.images];
    }
    if (updatedPayload.deleteImages &&
        updatedPayload.deleteImages.length > 0 &&
        isTourExist.images &&
        isTourExist.images.length > 0) {
        const restDBImages = isTourExist.images.filter((imageURL) => { var _a; return !((_a = updatedPayload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageURL)); });
        const updatedPayloadImages = (updatedPayload.images || [])
            .filter((imageURL) => { var _a; return !((_a = updatedPayload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageURL)); })
            .filter((imageURL) => !restDBImages.includes(imageURL));
        updatedPayload.images = [...restDBImages, ...updatedPayloadImages];
    }
    const updatedTour = yield tour_model_1.Tour.findByIdAndUpdate(tourId, updatedPayload, {
        new: true,
    });
    if (updatedPayload.deleteImages &&
        updatedPayload.deleteImages.length > 0 &&
        isTourExist.images &&
        isTourExist.images.length > 0) {
        yield Promise.all(updatedPayload.deleteImages.map((url) => (0, cloudinary_config_1.deleteImageFromCloudinary)(url)));
    }
    return updatedTour;
});
const deleteTour = (tourId) => __awaiter(void 0, void 0, void 0, function* () {
    const isTourExist = yield tour_model_1.Tour.findById(tourId);
    if (!isTourExist) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, "Tour Not Found");
    }
    yield tour_model_1.Tour.findByIdAndDelete(tourId);
});
exports.TourTypeServices = {
    getAllTourType,
    createTourType,
    updateTourType,
    deleteTourType,
};
exports.TourServices = {
    getAllTour,
    createTour,
    updateTour,
    deleteTour,
};
