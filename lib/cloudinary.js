import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  secure: true,
  // CLOUDINARY_URL can configure everything; keep explicit for clarity if present
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(file, folder = "pooye") {
  // file can be a base64 data URI or remote URL; resource_type:auto handles images, videos, raw (pdf, docs, etc.)
  const res = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: "auto",
  });
  return {
    publicId: res.public_id,
    url: res.secure_url,
    resourceType: res.resource_type,
    format: res.format,
    bytes: res.bytes,
  };
}


