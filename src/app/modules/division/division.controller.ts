import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DivisoinServices } from "./division.service";
import httpStatus from "http-status-codes";

const getAllDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const divisions = await DivisoinServices.getAllDivision(
      query as Record<string, string>
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Division retrieve successfully",
      data: divisions,
    });
  }
);
const getSingleDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const division = await DivisoinServices.getSingleDivision(slug);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Division retrieve successfully",
      data: division,
    });
  }
);
const createDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: IDivision = {
      ...req.body,
      thumbnail: req.file?.path,
    };
    const divisionData = await DivisoinServices.createDivision(payload);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Division created successfully",
      data: divisionData,
    });
  }
);
const updateDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: IDivision = {
      ...req.body,
      thumbnail: req.file?.path,
    };
    const divisionData = await DivisoinServices.updateDivision(
      payload,
      req.params.id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Division updated successfully",
      data: divisionData,
    });
  }
);
const deleteDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await DivisoinServices.deleteDivision(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Division deleted successfully",
      data: null,
    });
  }
);

export const DivisionControllers = {
  getAllDivision,
  createDivision,
  updateDivision,
  deleteDivision,
  getSingleDivision,
};
