
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json({ limit: "20kb" }));
app.use(express.static(__dirname));

// Savolni soddalashtiramiz
function tozalash(matn) {
  return matn
    .toLowerCase()
    .replace(/[ʻ’‘`]/g, "'")
    .replace(/[?!.,;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Bobo javoblari
function boboJavob(savol) {
  const s = tozalash(savol);

  if (!s) {
    return "Savolingni yozib yubor 😊";
  }

  // Salomlashish
  if (/^(salom|assalomu alaykum|assalom|hello|hi)\b/.test(s)) {
    return "Salom! 😊 Men Bobo ustozman! Qaysi fan yoki mavzuni birga o‘rganamiz?";
  }

  if (s.includes("rahmat")) {
    return "Arzimaydi! 😊 Yana savoling bo‘lsa, bemalol so‘ra.";
  }

  if (
    s.includes("isming") ||
    s.includes("kimsan") ||
    s.includes("sen kimsan")
  ) {
    return "Men Bobo ustozman! 📚 Senga darslarni tushunishga va yangi bilimlarni o‘rganishga yordam beraman.";
  }

  if (
    s.includes("nima qila olasan") ||
    s.includes("nimalarni bilasan") ||
    s.includes("yordam bera olasan")
  ) {
    return "Men matematika, ona tili, ingliz tili, tarix, geografiya, informatika va Python dasturlash bo‘yicha tayyor tushuntirishlar bera olaman. Qaysi mavzudan boshlaymiz? 😊";
  }

  // Xavfsizlik
  if (
    s.includes("parolni buz") ||
    s.includes("akkauntni buz") ||
    s.includes("virus yarat") ||
    s.includes("birovni hack") ||
    s.includes("bomba yas") ||
    s.includes("qurol yas")
  ) {
    return "Bu ish bo‘yicha ko‘rsatma bera olmayman. 🛡️ Lekin kiberxavfsizlik, internetda o‘zingni himoya qilish yoki xavfsiz dasturlashni o‘rganishimiz mumkin.";
  }

  // Informatika va Python
  if (
    s.includes("ozgaruvchi") ||
    s.includes("o'zgaruvchi") ||
    s.includes("o'zgaruvchilar") ||
    s.includes("ozgaruvchilar") ||
    s.includes("informatika") ||
    s.includes("python") ||
    s.includes("dasturlash")
  ) {
    if (
      s.includes("if") ||
      s.includes("shart operator") ||
      s.includes("shartli")
    ) {
      return `💻 Python'da if shart operatori shartni tekshiradi.

Misol:
yosh = 14

if yosh >= 13:
    print("Salom!")

Agar yosh 13 yoki undan katta bo‘lsa, Salom! chiqadi.

🧠 Mashq: son 10 dan katta bo‘lsa, "Katta son" chiqaradigan kod yozib ko‘r.`;
    }

    if (
      s.includes("for") ||
      s.includes("while") ||
      s.includes("sikl") ||
      s.includes("takrorlash")
    ) {
      return `🔁 Python'da sikllar kodni takrorlash uchun ishlatiladi.

Misol:
for i in range(5):
    print(i)

Natija:
0
1
2
3
4

🧠 range(5) sonlarni 0 dan 4 gacha beradi. Yana qaysi mavzuni o‘rganamiz?`;
    }

    if (
      s.includes("funksiya") ||
      s.includes("def ") ||
      s.includes("funksiyalar")
    ) {
      return `🐍 Python'da funksiya def bilan yaratiladi.

Misol:
def salom():
    print("Salom!")

salom()

Bu kod Salom! deb chiqaradi.

Funksiya kodni qayta ishlatishga yordam beradi.`;
    }

    if (
      s.includes("list") ||
      s.includes("royxat") ||
      s.includes("ro'yxat") ||
      s.includes("royxatlar")
    ) {
      return `📋 Python'da list bir nechta qiymatni saqlaydi.

Misol:
mevalar = ["olma", "anor", "uzum"]

print(mevalar[0])

Natija:
olma

Eslatma: Python'da ro‘yxat indeksi 0 dan boshlanadi.`;
    }

    return `💻 Keling, Python'dagi o‘zgaruvchilarni o‘rganamiz!

O‘zgaruvchi — ma'lumotni nom orqali saqlash usuli.

Misol:
ism = "Ali"
yosh = 14
ball = 95

Bu yerda:
• ism — matn saqlaydi.
• yosh — butun son saqlaydi.
• ball — son saqlaydi.

Ekranga chiqarish:
print(ism)
print(yosh)

Natija:
Ali
14

🧠 Mashq: o‘z ismingni ism o‘zgaruvchisiga, yoshingni yosh o‘zgaruvchisiga yoz va print() bilan chiqar!`;
  }

  // Matematika
  if (
    s.includes("matematika") ||
    s.includes("hisobla") ||
    s.includes("misol") ||
    s.includes("tenglama") ||
    /[0-9]+\s*[+\-*/]\s*[0-9]+/.test(s)
  ) {
    const hisob = s.match(
      /(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)/
    );

    if (hisob) {
      const a = Number(hisob[1]);
      const amal = hisob[2];
      const b = Number(hisob[3]);
      let natija;

      if (amal === "+") natija = a + b;
      if (amal === "-") natija = a - b;
      if (amal === "*") natija = a * b;

      if (amal === "/") {
        if (b === 0) {
          return "Sonni nolga bo‘lish mumkin emas. Boshqa misol yozib ko‘r.";
        }
        natija = a / b;
      }

      return `🧮 Keling, hisoblaymiz!\n\n${a} ${amal} ${b} = ${natija}\n\nYana misol ishlaymizmi?`;
    }

    return "🧮 Matematikadan yordam beraman! Qo‘shish, ayirish, ko‘paytirish, bo‘lish yoki tenglama bo‘yicha savolingni yoz.";
  }

  // Ingliz tili
  if (
    s.includes("ingliz") ||
    s.includes("english") ||
    s.includes("tarjima qil")
  ) {
    const sozlar = {
      hello: "Salom",
      book: "Kitob",
      school: "Maktab",
      apple: "Olma",
      water: "Suv",
      friend: "Do‘st",
      teacher: "O‘qituvchi",
      computer: "Kompyuter",
      cat: "Mushuk",
      dog: "It"
    };

    for (const [en, uz] of Object.entries(sozlar)) {
      if (s.includes(en)) {
        return `🇬🇧 ${en} — ${uz}.\n\nYangi inglizcha so‘z o‘rganishni davom ettiramizmi?`;
      }
    }

    return "🇬🇧 Ingliz tilidan yordam beraman! Masalan, hello — salom, book — kitob, school — maktab. Qaysi so‘zni tarjima qilamiz?";
  }

  // Ona tili
  if (
    s.includes("ona tili") ||
    s.includes("ot") ||
    s.includes("fe'l") ||
    s.includes("sifat") ||
    s.includes("grammatika") ||
    s.includes("imlo")
  ) {
    return `✍️ Ona tilidan kichik dars!

• Ot — shaxs yoki narsani bildiradi: kitob, bola.
• Sifat — belgini bildiradi: chiroyli, katta.
• Fe'l — harakatni bildiradi: yugurdi, yozdi.

Misol: "Aqlli bola kitob o‘qidi."

Aqlli — sifat, bola va kitob — ot, o‘qidi — fe'l.

Qaysi mavzuni batafsil o‘rganamiz?`;
  }

  // Tarix
  if (s.includes("tarix")) {
    return "🏛️ Tarix o‘tmishda sodir bo‘lgan voqealarni o‘rganadi. O‘zbekiston tarixi, qadimgi dunyo yoki tarixiy shaxslar haqida savolingni yoz!";
  }

  // Geografiya
  if (s.includes("geografiya") || s.includes("davlat") || s.includes("poytaxt")) {
    return "🌍 Geografiya Yer, davlatlar, tabiat va xaritalarni o‘rganadi. Masalan, O‘zbekistonning poytaxti — Toshkent. Qaysi davlat yoki hudud haqida bilmoqchisan?";
  }

  // Tabiatshunoslik
  if (
    s.includes("tabiat") ||
    s.includes("hayvon") ||
    s.includes("o'simlik") ||
    s.includes("sayyora")
  ) {
    return "🌱 Tabiat haqida birga o‘rganamiz! Yer Quyosh atrofida aylanadi, o‘simliklar o‘sishi uchun suv, yorug‘lik va havo kerak. Qaysi mavzu qiziqtiradi?";
  }

  // Hazil
  if (s.includes("hazil")) {
    return "😄 Kompyuter nega sovuq qotmaydi? Chunki uning Windows oynalari bor!";
  }

  return `🤔 Bu savolga hali tayyor javobim yo‘q.

Men hozircha quyidagi mavzularda yordam bera olaman:
📘 Matematika
💻 Informatika va Python
🇬🇧 Ingliz tili
✍️ Ona tili
🌍 Geografiya
🏛️ Tarix
🌱 Tabiatshunoslik

Masalan: "Python'da o‘zgaruvchilarni o‘rgat" yoki "25 + 17 ni hisobla" deb yoz 😊`;
}

// Saytni ochish
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Chatdan savol olish
app.post("/api/chat", (req, res) => {
  const prompt = req.body?.prompt;

  if (typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({
      error: "Iltimos, savolingni yoz."
    });
  }

  try {
    const text = boboJavob(prompt);
    res.json({ text });
  } catch (error) {
    console.error("Xato:", error);
    res.status(500).json({
      error: "Bobo javob berishda xatolik yuz berdi."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Bobo serveri ${PORT}-portda ishlayapti.`);
});
