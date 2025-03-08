import axios from "axios";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export const uploadToCloudinary = async (
  file: File,
  publicId?: string,
  api_key?: string,
  timestamp?: number,
  signature?: string
): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET); // Pre-configured in Cloudinary
    console.log("this is public", publicId);

    if (publicId && api_key && timestamp && signature) {
      formData.append("public_id", publicId);
      // formData.append("api_key", api_key);
      // formData.append("timestamp", timestamp.toString());
      // formData.append("signature", signature);
      // formData.append("invalidate", "true");
      // formData.append("overwrite", "true");
    }
    const response = await axios.post(UPLOAD_URL, formData);
    return response.data.secure_url; // Return the uploaded image URL
  } catch (error) {
    console.error("Cloudinary Upload Failed:", error);
    return null;
  }
};
export const uploadUpdateContract = async (
  file: File,
  newPublicId?: string
): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    console.log("this is public", newPublicId);

    if (newPublicId) {
      formData.append("public_id", newPublicId);
    }
    const response = await axios.post(UPLOAD_URL, formData);
    return response.data.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Failed:", error);
    return null;
  }
};

export const extractPublicId = (url: string) => {
  const parts = url.split("/upload");
  console.log("parts", parts[1].split(".pdf")[0]);

  return parts[1].split(".pdf")[0]; // Extract the public ID
};
