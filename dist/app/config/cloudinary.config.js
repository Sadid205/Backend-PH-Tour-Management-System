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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryUpload = exports.uploadBufferToCloudinary = exports.deleteImageFromCloudinary = void 0;
// Amader Folder -> image -> Form data -> File -> Multer -> Amader project / pc te  Nijer ekta folder(temporary) -> Req.file
// @typescript-eslint/no-explicit-any
const cloudinary_1 = require("cloudinary");
const env_1 = require("./env");
const AppErrors_1 = __importDefault(require("../errorHelpers/AppErrors"));
// req.file -> Cloudinary(req.file) -> url -> mongoose -> mongodb
cloudinary_1.v2.config({
    cloud_name: env_1.envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: env_1.envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: env_1.envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
});
// Multer Storage Cloudinary
// Frontend -> Form Data With Image File -> Multer -> Form Data -> Req(Body + File)
// Amader Folder -> image -> Form data -> File -> Multer Storage in cloudinary -> url -> Req.file
// url -> mongoose -> mongodb
const deleteImageFromCloudinary = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // https://res.cloudinary.com/ddxeovjdh/image/upload/v1753264446/0ft5axrk663-1753264442829-screenshot%2C2025%2C07%2C09%2C110322.png
        const regex = /\/v\d+\/(.+?)\.(png|jpe?g|webp|gif)$/i;
        const match = url.match(regex);
        if (match && match[1]) {
            const public_id = decodeURIComponent(match[1]);
            yield cloudinary_1.v2.uploader.destroy(public_id);
            console.log(`File ${public_id} is deleted from cloudinary`);
        }
    }
    catch (error) {
        throw new AppErrors_1.default(401, "Cloudinary image deletion failed", error.message);
    }
});
exports.deleteImageFromCloudinary = deleteImageFromCloudinary;
const uploadBufferToCloudinary = (buffer, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return new Promise((resolve, reject) => {
            const public_id = `pdf-${fileName}-${Date.now()}`;
            // const bufferStream = new stream.PassThrough();
            // bufferStream.end(buffer);
            cloudinary_1.v2.uploader
                .upload_stream({
                resource_type: "auto",
                public_id: public_id,
                folder: "pdf",
            }, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            })
                .end(buffer);
        });
    }
    catch (error) {
        console.log(error);
        throw new AppErrors_1.default(401, `Error uploading file ${error.message}`);
    }
});
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
exports.cloudinaryUpload = cloudinary_1.v2;
