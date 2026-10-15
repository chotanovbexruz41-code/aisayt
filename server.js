
import express from "express";
import OpenAI from "openai";
import path from "node:path";

const app = express();

app.use(express.json({ limit: "20kb" }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Bobo saytining index.html fayli asosiy papkada
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "index.html"));
});

// Frontend serverda API kaliti borligini tekshiradi
app.get("/api/health", (req, res) => {
  res.json({
    configured: Boolean(process.env.OPENAI_API_KEY)
  });
});

// AI so'rovlarini qayta ishlash
app.post("/api/chat", async (req, res) => {
  try {
    const { prompt, jsonMode = false } = req.body || {};

    if (typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        error: "Savol yoki mavzu yuborilmadi."
      });
    }

    if (prompt.length > 12000) {
      return res.status(400).json({
        error: "Xabar juda uzun."
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        error: "Railway'da OPENAI_API_KEY sozlanmagan."
      });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Siz Bobo — o‘zbek tilida gapiradigan, 1–6-sinf bolalariga sodda va do‘stona tushuntiradigan AI o‘qituvchisiz. Savollarga yoshga mos, tushunarli javob bering. JSON so‘ralsa, faqat to‘g‘ri JSON qaytaring."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      ...(jsonMode
        ? { response_format: { type: "json_object" } }
        : {})
    });

    const text =
      response.choices?.[0]?.message?.content || "";

    res.json({ text });
  } catch (error) {
    console.error("OpenAI xatosi:", error.message);

    res.status(500).json({
      error: "AI javob bera olmadi. Railway Logs bo‘limini tekshiring."
    });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Bobo server ${port}-portda ishga tushdi`);
});
