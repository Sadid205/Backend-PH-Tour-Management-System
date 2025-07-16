import AppError from "../../errorHelpers/AppErrors";
// import { TourType } from "./TourType.model";
import httpStatus from "http-status-codes";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import { Division } from "../division/division.model";

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

const getAllTour = async (): Promise<Partial<ITour[]>> => {
  const Tours = await Tour.find({});
  return Tours;
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
  const slugText = title?.split(" ").join("-").toLowerCase();

  const isTourExist = await Tour.findOne({ slug: slugText });
  if (isTourExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour Already Exist");
  }
  const tour = await Tour.create({
    title,
    division,
    tourType,
    slug: slugText,
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

  if (payload.title) {
    updatedPayload.slug = payload.title.split(" ").join("-").toLowerCase();
  }
  const isTourExist = await Tour.findById(tourId);
  if (!isTourExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour Not Found");
  }
  const updatedTour = await Tour.findByIdAndUpdate(tourId, updatedPayload, {
    new: true,
  });
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
