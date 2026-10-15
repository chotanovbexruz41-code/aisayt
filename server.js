
import express from "express";
import OpenAI from "openai";
import path from "node:path";

const app = express();

app.use(express.json({ limit: "20kb" }));

app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "index.html"));
});

app.get("/api/health", (req, res) => {
  res.json({
    configured: Boolean(process.env.MISTRAL_API_KEY)
  });
});

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

    if (!process.env.MISTRAL_API_KEY) {
      return res.status(503).json({
        error: "Railway'da MISTRAL_API_KEY sozlanmagan."
      });
    }

    const client = new OpenAI({
      apiKey: process.env.MISTRAL_API_KEY,
      baseURL: "https://api.mistral.ai/v1"
    });

    const response = await client.chat.completions.create({
      model: "mistral-small-latest",
      messages: [
        {
          role: "system",
          content:
            "Siz Bobo — o‘zbek tilida gapiradigan, 1–6-sinf o‘quvchilariga sodda va do‘stona tushuntiradigan AI o‘qituvchisiz. Javoblaringizni yoshga mos, tushunarli va foydali qiling. JSON so‘ralsa, faqat to‘g‘ri JSON qaytaring."
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
    console.error("Mistral API xatosi:", {
      status: error.status,
      code: error.code,
      message: error.message
    });

    res.status(500).json({
      error: "AI javob bera olmadi. Railway Logs bo‘limini tekshiring."
    });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Bobo server ${port}-portda ishga tushdi`);
});
