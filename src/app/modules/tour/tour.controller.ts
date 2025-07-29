// @typescript-eslint/no-unused-vars
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { TourServices, TourTypeServices } from "./tour.service";
import { ITour } from "./tour.interface";

// Tour Type Controllers
const getAllTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const TourTypes = await TourTypeServices.getAllTourType();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Tour type retrieve successfully",
      data: TourTypes,
    });
  }
);
const createTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const TourTypeData = await TourTypeServices.createTourType(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Tour type created successfully",
      data: TourTypeData,
    });
  }
);
const updateTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const TourTypeData = await TourTypeServices.updateTourType(
      req.body,
      req.params.id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Tour type updated successfully",
      data: TourTypeData,
    });
  }
);
const deleteTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await TourTypeServices.deleteTourType(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Tour type deleted successfully",
      data: null,
    });
  }
);
// Tour Controlers
const getAllTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await TourServices.getAllTour(
      query as Record<string, string>
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Tour retrieve successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);
const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: ITour = {
      ...req.body,
      images: (req.files as Express.Multer.File[]).map((file) => file.path),
    };
    const TourData = await TourServices.createTour(payload);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Tour created successfully",
      data: TourData,
    });
  }
);
const updateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: ITour = {
      ...req.body,
      images: (req.files as Express.Multer.File[]).map((file) => file.path),
    };
    const TourData = await TourServices.updateTour(payload, req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Tour updated successfully",
      data: TourData,
    });
  }
);
const deleteTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await TourServices.deleteTour(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Tour deleted successfully",
      data: null,
    });
  }
);

export const TourTypeControllers = {
  getAllTourType,
  createTourType,
  updateTourType,
  deleteTourType,
};

export const TourControllers = {
  getAllTour,
  createTour,
  updateTour,
  deleteTour,
};
