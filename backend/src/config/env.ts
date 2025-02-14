const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI || "";
const JWT_SECRET = process.env.JWT_SECRET || "";
const NODE_ENV = process.env.NODE_ENV || "development";
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "";
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "";

export {
  PORT,
  DB_URI,
  JWT_SECRET,
  NODE_ENV,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
};
