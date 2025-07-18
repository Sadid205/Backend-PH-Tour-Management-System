import AppError from "../../errorHelpers/AppErrors";
import { Division } from "./division.model";
import httpStatus from "http-status-codes";

const getAllDivision = async () => {
  const divisions = await Division.find({});
  const totalDivisions = await Division.countDocuments({});
  return {
    data: divisions,
    meta: {
      total: totalDivisions,
    },
  };
};
const createDivision = async (
  payload: Partial<IDivision>
): Promise<Partial<IDivision>> => {
  const { name, ...rest } = payload;

  const isDivisionExist = await Division.findOne({ name: name });
  if (isDivisionExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Division Already Exist");
  }
  const division = await Division.create({
    name,
    ...rest,
  });
  return division;
};

const updateDivision = async (
  payload: Partial<IDivision>,
  divisionId: string
): Promise<Partial<IDivision>> => {
  const updatedPayload = { ...payload };

  const isDivisionExist = await Division.findById(divisionId);
  if (!isDivisionExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Division Not Found");
  }

  const duplicateDivision = await Division.findOne({
    name: payload.name ? payload.name : isDivisionExist.name,
    _id: { $ne: divisionId },
  });

  if (duplicateDivision) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Division Already Exist With This Name"
    );
  }

  const updatedDivision = await Division.findByIdAndUpdate(
    divisionId,
    updatedPayload,
    {
      new: true,
      runValidators: true,
    }
  );
  return updatedDivision!;
};
const deleteDivision = async (divisionId: string): Promise<void> => {
  const isDivisionExist = await Division.findById(divisionId);
  if (!isDivisionExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Division Not Found");
  }
  await Division.findByIdAndDelete(divisionId);
};

export const DivisoinServices = {
  getAllDivision,
  createDivision,
  updateDivision,
  deleteDivision,
};
