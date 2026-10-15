
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
    configured: Boolean(process.env.OPENAI_API_KEY?.trim())
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { prompt, jsonMode = false } = req.body || {};

    if (typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        error: "Savol yuborilmadi."
      });
    }

    if (prompt.length > 12000) {
      return res.status(400).json({
        error: "Xabar juda uzun."
      });
    }

    const apiKey = process.env.OPENAI_API_KEY?.trim();

    if (!apiKey) {
      return res.status(503).json({
        error: "Railway Variables bo‘limida OPENAI_API_KEY yo‘q."
      });
    }

    const client = new OpenAI({ apiKey });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Sen Bobo, o‘zbek tilida gapiradigan, 1–6-sinf o‘quvchilariga mavzularni sodda va do‘stona tushuntiradigan AI o‘qituvchisan."
        },
        {
          role: "user",
          content: prompt.trim()
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      ...(jsonMode
        ? { response_format: { type: "json_object" } }
        : {})
    });

    res.json({
      text: response.choices?.[0]?.message?.content || "Javob olinmadi."
    });
  } catch (error) {
    const status = error.status || 500;

    // Maxfiy API kalitini Logs'ga yozmaymiz.
    console.error("OpenAI xatosi:", {
      status,
      code: error.code || "unknown",
      message: error.message
    });

    if (status === 401) {
      return res.status(502).json({
        error: "OpenAI API kaliti qabul qilinmadi. Kalit va loyiha sozlamalarini tekshiring."
      });
    }

    if (status === 429) {
      return res.status(502).json({
        error: "OpenAI limiti yoki krediti bilan muammo bor. Billing va foydalanish limitini tekshiring."
      });
    }

    res.status(500).json({
      error: "AI xizmatida xato yuz berdi. Railway Logs'ni tekshiring."
    });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Bobo server ${port}-portda ishga tushdi`);
});
