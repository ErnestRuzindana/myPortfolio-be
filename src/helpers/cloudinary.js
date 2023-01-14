import dotenv from "dotenv";
import cloudinary from "cloudinary";
dotenv.config();


cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// const uploadImage = async (image, path) => {
//     try {
//          await cloudinary.uploader.upload(image, {
//             quality: "auto",
//             resource_type: "image",
//             folder: path,
//         });
//     } catch (error) {
//         return res.status(500).json({ error: "Failed to save image" })
//     }

// }

// const deleteImage = async (url) => {
//     try {
//         const deleteResponse = await cloudinary.uploader.destroy(url);
//         return deleteResponse;
//     } catch (error) {
//         return res.status(500).json({ error: "Failed to delete image" })
//     }

// }


export default cloudinary;

