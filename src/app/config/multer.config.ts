//no-useless-escape
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req, file) => {
      // My Special.Image#!@.png => 42442rwerwrtwer-3433432423-my-image.png
      // My Special.Image#!@.png => [ My Special,Image#!@,png ]
      const fileName = file.originalname
        .toLowerCase()
        .replace(/\s+/g, "-") // empty space remove replace with dash
        .replace(/\./g, "-") //
        .replace(/[^a-z0-9\-]/g, "") // non alpha numeric =!@#$
        .split("-")
        .slice(0, -1);

      // binary -> 0,1 hexa decimal -> 0-9 A-F base 36 -> 0-9 a-z
      // 0.2334234231 ->"0.hedfwerwexrfws" ->
      //5234234234
      const uniqueFileName =
        Math.random().toString(36).substring(2) +
        "-" +
        Date.now() +
        "-" +
        fileName;
      // "." +
      // extension;
      return uniqueFileName;
    },
  },
});

export const multerUpload = multer({ storage: storage });
