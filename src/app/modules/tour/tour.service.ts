import AppError from "../../errorHelpers/AppErrors";
// import { TourType } from "./TourType.model";
import httpStatus from "http-status-codes";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import { Division } from "../division/division.model";
import { tourSearchableFields } from "./tour.constant";
import { excludeField } from "../../constant";
import { Query } from "mongoose";
import { QueryBuilder } from "../../utils/queryBuilder";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";

// Tour Type Services
const getAllTourType = async (): Promise<Partial<ITourType[]>> => {
  const TourTypes = await TourType.find({});
  return TourTypes;
};
const createTourType = async (
  payload: Partial<ITourType>
): Promise<Partial<ITourType>> => {
  const isTourTypeExist = await TourType.findOne({ name: payload.name });
  if (isTourTypeExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "TourType Already Exist");
  }
  const newTourType = await TourType.create({ ...payload });
  return newTourType;
};

const updateTourType = async (
  payload: Partial<ITourType>,
  tourTypeId: string
): Promise<Partial<ITourType>> => {
  const isTourTypeExist = await TourType.findById(tourTypeId);
  if (!isTourTypeExist) {
    throw new AppError(httpStatus.NOT_FOUND, "TourType Not Found");
  }
  const updatedTourType = await TourType.findByIdAndUpdate(
    tourTypeId,
    payload,
    {
      new: true,
    }
  );
  return updatedTourType!;
};
const deleteTourType = async (tourTypeId: string): Promise<void> => {
  const isTourTypeExist = await TourType.findById(tourTypeId);
  if (!isTourTypeExist) {
    throw new AppError(httpStatus.NOT_FOUND, "TourType Not Found");
  }
  await TourType.findByIdAndDelete(tourTypeId);
};

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

const getAllTour = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query);
  const tours = queryBuilder
    .search(tourSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  // const meta = await queryBuilder.getMeta();
  const [data, meta] = await Promise.all([
    tours.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const createTour = async (payload: Partial<ITour>): Promise<Partial<ITour>> => {
  const { title, division, tourType, ...rest } = payload;

  const isTourTypeExist = await TourType.findById(tourType);
  if (!isTourTypeExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour Type Not Found");
  }
  const isDivisionExist = await Division.findById(division);
  if (!isDivisionExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Division Type Not Found");
  }

  const isTourExist = await Tour.findOne({ title: title });
  if (isTourExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour Already Exist");
  }
  const tour = await Tour.create({
    title,
    division,
    tourType,
    ...rest,
  });
  return tour;
};

const updateTour = async (
  payload: Partial<ITour>,
  tourId: string
): Promise<Partial<ITour>> => {
  const updatedPayload = { ...payload };
  if (updatedPayload.division) {
    const isDivisionExist = await Division.findById(updatedPayload.division);
    if (!isDivisionExist) {
      throw new AppError(httpStatus.NOT_FOUND, "Division Type Not Found");
    }
  }
  if (updatedPayload.tourType) {
    const isTourTypeExist = await TourType.findById(updatedPayload.tourType);
    if (!isTourTypeExist) {
      throw new AppError(httpStatus.NOT_FOUND, "Tour Type Not Found");
    }
  }

  const isTourExist = await Tour.findById(tourId);
  if (!isTourExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour Not Found");
  }
  if (
    updatedPayload.images &&
    updatedPayload.images.length > 0 &&
    isTourExist.images &&
    isTourExist.images.length > 0
  ) {
    updatedPayload.images = [...updatedPayload.images, ...isTourExist.images];
  }
  if (
    updatedPayload.deleteImages &&
    updatedPayload.deleteImages.length > 0 &&
    isTourExist.images &&
    isTourExist.images.length > 0
  ) {
    const restDBImages = isTourExist.images.filter(
      (imageURL) => !updatedPayload.deleteImages?.includes(imageURL)
    );
    const updatedPayloadImages = (updatedPayload.images || [])
      .filter((imageURL) => !updatedPayload.deleteImages?.includes(imageURL))
      .filter((imageURL) => !restDBImages.includes(imageURL));
    updatedPayload.images = [...restDBImages, ...updatedPayloadImages];
  }
  const updatedTour = await Tour.findByIdAndUpdate(tourId, updatedPayload, {
    new: true,
  });
  if (
    updatedPayload.deleteImages &&
    updatedPayload.deleteImages.length > 0 &&
    isTourExist.images &&
    isTourExist.images.length > 0
  ) {
    await Promise.all(
      updatedPayload.deleteImages.map((url) => deleteImageFromCloudinary(url))
    );
  }
  return updatedTour!;
};

const deleteTour = async (tourId: string): Promise<void> => {
  const isTourExist = await Tour.findById(tourId);
  if (!isTourExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour Not Found");
  }
  await Tour.findByIdAndDelete(tourId);
};

export const TourTypeServices = {
  getAllTourType,
  createTourType,
  updateTourType,
  deleteTourType,
};

export const TourServices = {
  getAllTour,
  createTour,
  updateTour,
  deleteTour,
};
