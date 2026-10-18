
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "20kb" }));
app.use(express.static(__dirname));

const systemPrompt = `
Sen Bobo nomli aqlli, samimiy va sabrli AI ustozsan.

1–6-sinf o‘quvchilariga maktab fanlarini o‘rganishda yordam ber.
O‘zbek tilida tabiiy, do‘stona va tushunarli gapir.
Matematika, ona tili, ingliz tili, tarix, geografiya,
tabiatshunoslik, informatika va dasturlashni tushuntir.
Masalalarni bosqichma-bosqich tushuntir.
Bilmasang, to‘qib chiqarma.
Zararli, xavfli yoki yoshga mos bo‘lmagan ko‘rsatmalarni berma.
O‘quvchini haqorat qilma, muloyim va sabrli bo‘l.
`;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/api/chat", async (req, res) => {
  try {
    const prompt = req.body?.prompt;

    if (typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Savol yuborilmadi." });
    }

    const apiKey = process.env.MISTRAL_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "MISTRAL_API_KEY Railway sozlamalarida topilmadi."
      });
    }

    const response = await fetch(
      "https://api.mistral.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "mistral-small-latest",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt.trim().slice(0, 12000) }
          ]
        })
      }
    );

    if (!response.ok) {
      console.error("Mistral API xatosi:", response.status);
      return res.status(502).json({
        error: "Bobo hozir javob bera olmadi. Birozdan keyin urinib ko‘r."
      });
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content;

    if (typeof answer !== "string") {
      return res.status(502).json({
        error: "Boboning javobini olishda xatolik yuz berdi."
      });
    }

    res.json({ text: answer });
  } catch (error) {
    console.error("Server xatosi:", error.message);
    res.status(500).json({
      error: "Serverda xatolik yuz berdi."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Bobo AI serveri ${PORT}-portda ishga tushdi.`);
});
