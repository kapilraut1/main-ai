import Post from "../models/Posts.js";
import * as dotenv from "dotenv";
import { createError } from "../error.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout:120000,
});

const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "your_folder_name" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};
// Get all posts
export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({});
    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    return next(
      createError(
        error.status,
        error?.response?.data?.error.message || error.message
      )
    );
  }
};

// Create new post
// export const createPost = async (req, res, next) => {
//   try {
//     const { name, prompt, photo } = req.body;
//     const photoUrl = await cloudinary.uploader.upload(photo)
//     const newPost = await Post.create({
//       name, 
//       prompt, 
//       photo: photoUrl?.secure_url,
//     });

//     return res.status(201).json({ success: true, data: newPost });
//   }
  
//   catch(error){
//     // Remove data URL prefix if present
    
//   next(
//       createError(error.status || 500, error?.response?.data?.error.message || error.message)
//     );
//   }
// };

export const createPost = async (req, res, next) => {
  try {
    const { name, prompt, photo } = req.body;

    if (!name || !prompt || !photo) {
      return res.status(400).json({ success: false, message: "Missing name, prompt, or photo." });
    }

    // Remove data URI prefix
    const base64Data = photo.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const uploaded = await uploadFromBuffer(buffer);

    const newPost = await Post.create({
      name,
      prompt,
      photo: uploaded.secure_url,
    });

    return res.status(200).json({ success: true, data: newPost });
  } catch (error) {
    console.error("Error in createPost:", error);
    return next(
      createError(error.status || 500, error.message || "Internal server error")
    );
  }
};
