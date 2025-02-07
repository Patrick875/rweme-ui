import axios from "axios";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export const uploadToCloudinary = async (
  file: File
): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET); // Pre-configured in Cloudinary
    const response = await axios.post(UPLOAD_URL, formData);
    return response.data.secure_url; // Return the uploaded image URL
  } catch (error) {
    console.error("Cloudinary Upload Failed:", error);
    return null;
  }
};
