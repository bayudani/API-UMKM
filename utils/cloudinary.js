import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config'; // Pastikan ini ada

if (!process.env.CLOUDINARY_URL) {
    console.error("⚠️ CLOUDINARY_URL tidak ditemukan di .env!");
    console.error("👉  Pastikan format di .env: CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME");
} else {
    cloudinary.config({
        secure: true
    });
    console.log("✅ Cloudinary Config Loaded!");
}

const uploadToCloudinary = (fileBuffer, folder = 'umkm_products', resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    // Upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder: folder,
        resource_type: resourceType
      },
      (error, result) => {
        if (error) {
            console.error("❌ Cloudinary Error:", error.message);
            return reject(error);
        }
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export { cloudinary, uploadToCloudinary };