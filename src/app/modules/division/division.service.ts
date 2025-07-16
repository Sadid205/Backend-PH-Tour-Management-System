import AppError from "../../errorHelpers/AppErrors";
import { Division } from "./division.model";
import httpStatus from "http-status-codes";

const getAllDivision = async (): Promise<Partial<IDivision[]>> => {
  const divisions = await Division.find({});
  return divisions;
};
const createDivision = async (
  payload: Partial<IDivision>
): Promise<Partial<IDivision>> => {
  const { name, ...rest } = payload;

  const slugText = name?.split(" ").join("-").toLowerCase();

  const isDivisionExist = await Division.findOne({ slug: slugText });
  if (isDivisionExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Division Already Exist");
  }
  const division = await Division.create({
    name,
    slug: slugText,
    ...rest,
  });
  return division;
};

const updateDivision = async (
  payload: Partial<IDivision>,
  divisionId: string
): Promise<Partial<IDivision>> => {
  const updatedPayload = { ...payload };
  if (payload.name) {
    updatedPayload.slug = payload.name.split(" ").join("-").toLowerCase();
  }
  const isDivisionExist = await Division.findById(divisionId);
  if (!isDivisionExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Division Not Found");
  }
  const updatedDivision = await Division.findByIdAndUpdate(
    divisionId,
    updatedPayload,
    {
      new: true,
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
