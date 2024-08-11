import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'
import { configDotenv } from "dotenv";

// make .env available before any work
configDotenv({
    path: "./.env"
})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            throw new Error("Local file path is Required ")
        }
        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        // console.log("File is Uploaded On cloudinary");
        // console.log(response.url)
        fs.unlinkSync(localFilePath) // delete local file after cloud upload
        return response;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        // Ensure local file is deleted even if upload fails
        if (fs.existsSync(localFilePath)) {
            // fs.unlinkSync(localFilePath);
        }
        throw error;
    }
};


const deletefromcloudinary = async (public_id) => {
    try {
        const response = await cloudinary.uploader.destroy(public_id, { invalidate: true });
        // console.log('Delete response:', response);
        return response;
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw error;
    }
};

const videodeletefromcloudinary = async (public_id) => {
    try {
        const response = await cloudinary.uploader.destroy(public_id, { 
            invalidate: true,
            resource_type: "video" 
        });
        // console.log('Delete response:', response);
        return response;
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw error;
    }
};

export { uploadOnCloudinary, deletefromcloudinary ,videodeletefromcloudinary} 
