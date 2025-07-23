// Amader Folder -> image -> Form data -> File -> Multer -> Amader project / pc te  Nijer ekta folder(temporary) -> Req.file
import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";

// req.file -> Cloudinary(req.file) -> url -> mongoose -> mongodb

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
});
// Multer Storage Cloudinary
// Frontend -> Form Data With Image File -> Multer -> Form Data -> Req(Body + File)
// Amader Folder -> image -> Form data -> File -> Multer Storage in cloudinary -> url -> Req.file
// url -> mongoose -> mongodb

export const cloudinaryUpload = cloudinary;
