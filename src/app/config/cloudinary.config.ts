// Amader Folder -> image -> Form data -> File -> Multer -> Amader project / pc te  Nijer ekta folder(temporary) -> Req.file
// @typescript-eslint/no-explicit-any
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { envVars } from "./env";
import AppError from "../errorHelpers/AppErrors";

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

export const deleteImageFromCloudinary = async (url: string) => {
  try {
    // https://res.cloudinary.com/ddxeovjdh/image/upload/v1753264446/0ft5axrk663-1753264442829-screenshot%2C2025%2C07%2C09%2C110322.png

    const regex = /\/v\d+\/(.+?)\.(png|jpe?g|webp|gif)$/i;
    const match = url.match(regex);
    if (match && match[1]) {
      const public_id = decodeURIComponent(match[1]);
      await cloudinary.uploader.destroy(public_id);
      console.log(`File ${public_id} is deleted from cloudinary`);
    }
  } catch (error: any) {
    throw new AppError(401, "Cloudinary image deletion failed", error.message);
  }
};

export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  fileName: string
): Promise<UploadApiResponse> => {
  try {
    return new Promise((resolve, reject) => {
      const public_id = `pdf-${fileName}-${Date.now()}`;
      // const bufferStream = new stream.PassThrough();
      // bufferStream.end(buffer);
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            public_id: public_id,
            folder: "pdf",
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result as UploadApiResponse);
          }
        )
        .end(buffer);
    });
  } catch (error: any) {
    console.log(error);
    throw new AppError(401, `Error uploading file ${error.message}`);
  }
};

export const cloudinaryUpload = cloudinary;
