const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors()); // CORS 허용
app.use(bodyParser.json({ limit: "10mb" }));

app.post("/generate-sticker", async (req, res) => {
  const { imageBase64, style } = req.body;

  try {
    const response = await axios.post(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        prompt: `ultrasound photo sticker in ${style} style`,
        image: imageBase64,
        mode: "image-to-image",
        output_format: "png"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );

    const imageUrl = response.data?.image?.url || null;
    res.json({ imageUrl });
  } catch (error) {
    console.error("Stability API error:", error.message);
    res.status(500).json({ error: "Image generation failed", detail: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
