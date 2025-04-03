const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

app.post('/generate-sticker', async (req, res) => {
  const { imageBase64, style } = req.body;

  console.log("🔥 요청 도착!");
  console.log("👉 받은 스타일:", style);
  console.log("👉 받은 이미지 길이:", imageBase64 ? imageBase64.length : "없음");

  const stylePrompts = {
    kawaii: "cute baby sticker illustration, pastel colors, kawaii style",
    anime: "anime chibi baby sticker with big eyes",
    watercolor: "watercolor baby sticker, soft tones",
    rainbow: "dreamy rainbow baby sticker with clouds"
  };

  const prompt = stylePrompts[style] || stylePrompts["kawaii"];

  try {
    const response = await fetch("https://api.stability.ai/v2beta/image-to-image", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STABILITY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        init_image: imageBase64,
        prompt: prompt,
        mode: "image-to-image",
        cfg_scale: 7,
        steps: 30
      })
    });

    const data = await response.json();
    console.log("📦 Stability 응답:", data);
    res.json({ imageUrl: data.image });
  } catch (err) {
    console.error("❌ Stability 호출 오류:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => {
  console.log("✅ Server running on port 4000");
});
