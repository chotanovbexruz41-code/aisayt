
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.static(__dirname));

function boboJavob(savol) {
  const s = savol.toLowerCase().trim();

  if (/^(salom|assalomu alaykum|hello|hi)\b/.test(s)) {
    return "Salom! 😊 Men Bobo ustozman. Qaysi fan bo‘yicha yordam beray?";
  }

  if (s.includes("isming") || s.includes("kimsan")) {
    return "Men Bobo ustozman! 📚 Senga darslarni o‘rganishda yordam beraman.";
  }

  if (s.includes("rahmat")) {
    return "Arzimaydi! 😊 Yana savoling bo‘lsa, bemalol so‘ra.";
  }

  if (s.includes("matematika") || s.includes("misol")) {
    return "🧮 Keling, matematikani o‘rganamiz! Masalan, 25 + 15 = 40. Qaysi misolni yechmoqchisan?";
  }

  if (s.includes("ingliz") || s.includes("english")) {
    return "🇬🇧 Ingliz tilida 'Hello' — 'Salom', 'Book' — 'Kitob', 'School' — 'Maktab'. Qaysi so‘zni o‘rganamiz?";
  }

  if (s.includes("ona tili") || s.includes("grammatika")) {
    return "✍️ Ona tilidan yordam beraman! Gap, so‘z turkumlari yoki imlo qoidalaridan qaysi birini o‘rganamiz?";
  }

  if (s.includes("tarix")) {
    return "🏛️ Tarix — o‘tmishda sodir bo‘lgan voqealarni o‘rganuvchi fan. Qaysi tarixiy mavzu qiziqtiradi?";
  }

  if (s.includes("geografiya")) {
    return "🌍 Geografiya Yer, mamlakatlar, tabiat va xaritalarni o‘rganadi. Qaysi mavzuni bilmoqchisan?";
  }

  if (s.includes("informatika") || s.includes("python")) {
    return "💻 Informatika va dasturlashni birga o‘rganamiz! Python’da print('Salom') ekranga Salom deb chiqaradi.";
  }

  if (s.includes("yordam")) {
    return "Albatta! 😊 Men matematika, ona tili, ingliz tili, tarix, geografiya va informatika bo‘yicha tayyor javoblar bera olaman.";
  }

  if (s.includes("hazil")) {
    return "😄 Kompyuter nega sovuq qotmaydi? Chunki uning Windows oynalari bor!";
  }

  return "🤔 Bu savolga tayyor javobim yo‘q ekan. Mendan matematika, ingliz tili, ona tili, tarix yoki informatika haqida so‘rab ko‘r!";
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/api/chat", (req, res) => {
  const prompt = req.body?.prompt;

  if (typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "Savol yozing!" });
  }

  res.json({ text: boboJavob(prompt) });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Bobo serveri ${PORT}-portda ishlayapti`);
});
