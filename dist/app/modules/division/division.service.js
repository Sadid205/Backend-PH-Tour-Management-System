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
exports.DivisoinServices = void 0;
// @typescript-eslint/no-non-null-assertion
const cloudinary_config_1 = require("../../config/cloudinary.config");
const AppErrors_1 = __importDefault(require("../../errorHelpers/AppErrors"));
const queryBuilder_1 = require("../../utils/queryBuilder");
const division_constant_1 = require("./division.constant");
const division_model_1 = require("./division.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const getAllDivision = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new queryBuilder_1.QueryBuilder(division_model_1.Division.find(), query);
    const divisions = queryBuilder
        .search(division_constant_1.divisionSearchableFields)
        .filter()
        .sort()
        .paginate();
    const [data, meta] = yield Promise.all([
        divisions.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const getSingleDivision = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const divisions = yield division_model_1.Division.findOne({ slug: slug });
    return {
        data: divisions,
    };
});
const createDivision = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = payload, rest = __rest(payload, ["name"]);
    const isDivisionExist = yield division_model_1.Division.findOne({ name: name });
    if (isDivisionExist) {
        throw new AppErrors_1.default(http_status_codes_1.default.BAD_REQUEST, "Division Already Exist");
    }
    const division = yield division_model_1.Division.create(Object.assign({ name }, rest));
    return division;
});
const updateDivision = (payload, divisionId) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedPayload = Object.assign({}, payload);
    const isDivisionExist = yield division_model_1.Division.findById(divisionId);
    if (!isDivisionExist) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, "Division Not Found");
    }
    const duplicateDivision = yield division_model_1.Division.findOne({
        name: payload.name ? payload.name : isDivisionExist.name,
        _id: { $ne: divisionId },
    });
    if (duplicateDivision) {
        throw new AppErrors_1.default(http_status_codes_1.default.BAD_REQUEST, "Division Already Exist With This Name");
    }
    const updatedDivision = yield division_model_1.Division.findByIdAndUpdate(divisionId, updatedPayload, {
        new: true,
        runValidators: true,
    });
    if (payload.thumbnail && isDivisionExist.thumbnail) {
        yield (0, cloudinary_config_1.deleteImageFromCloudinary)(isDivisionExist.thumbnail);
    }
    return updatedDivision;
});
const deleteDivision = (divisionId) => __awaiter(void 0, void 0, void 0, function* () {
    const isDivisionExist = yield division_model_1.Division.findById(divisionId);
    if (!isDivisionExist) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, "Division Not Found");
    }
    yield division_model_1.Division.findByIdAndDelete(divisionId);
});
exports.DivisoinServices = {
    getAllDivision,
    createDivision,
    updateDivision,
    deleteDivision,
    getSingleDivision,
};
