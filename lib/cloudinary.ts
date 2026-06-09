import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: string, folder: string = "fb-content-hub") {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: "image",
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });
  return result;
}

export async function uploadVideo(file: string, folder: string = "fb-content-hub") {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: "video",
  });
  return result;
}

export async function deleteMedia(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}

export { cloudinary };
