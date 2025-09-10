import * as dotenv from "dotenv";
import { createError } from "../error.js";
import fetch from "node-fetch";

dotenv.config();

// Controller to generate Image from Cloudflare Worker (OpenAI-style response)
export const generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    const response = await fetch("https://free-image.rautkapil124.workers.dev/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.WORKER_SECRET_KEY}`, // optional
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Cloudflare Worker error: ${response.status} ${text}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    // Return in the same format as OpenAI API
    res.status(200).json({ photo: base64Image });
  } catch (error) {
    console.error("Error in generateImage:", error);
    next(
      createError(
        error.status || 500,
        error?.message || "Image generation failed"
      )
    );
  }
};
