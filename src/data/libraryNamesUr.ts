import { LibraryListObject } from "../interfaces";

const libraryUr: LibraryListObject[] = [
  { label: "SimplyE", value: "eb" },
  { label: "ہیری بیلفونٹے 115 ویں اسٹریٹ لائبریری", value: "hu" },
  { label: "", value: "hd" },
  { label: "125 اسٹریٹ لائبریری", value: "fe" },
  { label: "53 اسٹریٹ لائبریری", value: "ft" },
  { label: "67 اسٹریٹ لائبریری", value: "ss" },
  { label: "96 اسٹریٹ لائبریری", value: "ns" },
  { label: "Aguilar لائبریری", value: "ag" },
  { label: "ایلرٹن لائبریری", value: "al" },
  { label: "اینڈریو ہیسکل بریل اور ٹاکنگ بک لائبریری", value: "lb" },
  { label: "بیٹری پارک سٹی لائبریری", value: "bt" },
  { label: "Baychester لائبریری", value: "ba" },
  { label: "بیلمونٹ لائبریری", value: "be" },
  { label: "برونکس لائبریری سینٹر", value: "bc" },
  { label: "بلومنگ ڈیل لائبریری", value: "bl" },
  { label: "کیسل ہل لائبریری", value: "ct" },
  { label: "چتھم اسکوائر لائبریری", value: "ch" },
  { label: "سٹی آئی لینڈ لائبریری", value: "ci" },
  { label: "کلاسن پوائنٹ لائبریری", value: "cp" },
  { label: "کولمبس لائبریری", value: "cs" },
  { label: "کاؤنٹی کولن لائبریری", value: "ht" },
  { label: "ڈونگن ہلز لائبریری", value: "dh" },
  { label: "ایسٹ چیسٹر لائبریری", value: "ea" },
  { label: "ایپی فینی لائبریری", value: "ep" },
  { label: "ایڈن والڈ لائبریری", value: "ew" },
  { label: "فورٹ واشنگٹن لائبریری", value: "fw" },
  { label: "فرانسس مارٹن لائبریری", value: "fx" },
  { label: "جارج بروس لائبریری", value: "br" },
  { label: "گرینڈ سینٹرل لائبریری", value: "gc" },
  { label: "گرینڈ کنکورس لائبریری", value: "gd" },
  { label: "گریٹ کلز لائبریری", value: "gk" },
  { label: "ہیملٹن فش پارک لائبریری", value: "hf" },
  { label: "ہیملٹن گرینج لائبریری", value: "hg" },
  { label: "ہارلیم لائبریری", value: "hl" },
  { label: "ہائی برج لائبریری", value: "hb" },
  { label: "ہڈسن پارک لائبریری", value: "hp" },
  { label: "ہیوگینٹ پارک لائبریری", value: "hk" },
  { label: "ہنٹ پوائنٹ لائبریری", value: "hs" },
  { label: "ان ووڈ لائبریری", value: "in" },
  { label: "جیفرسن مارکیٹ لائبریری", value: "jm" },
  { label: "جیروم پارک لائبریری", value: "jp" },
  { label: "کنگز برج لائبریری", value: "kb" },
  { label: "کِپس بے لائبریری", value: "kp" },
  { label: "میکمبس برج لائبریری", value: "mb" },
  { label: "میرینرز ہاربر لائبریری", value: "mn" },
  { label: "میلروز لائبریری", value: "me" },
  { label: "مارننگ سائیڈ ہائٹس لائبریری", value: "cl" },
  { label: "لائبریری چور", value: "mo" },
  { label: "موٹ ہیون لائبریری", value: "mh" },
  { label: "مورس پارک لائبریری", value: "mp" },
  { label: "موریسانیہ لائبریری", value: "mr" },
  { label: "Muhlenberg لائبریری", value: "mu" },
  { label: "ملبیری اسٹریٹ لائبریری", value: "ml" },
  { label: "ایمسٹرڈیم کی نئی لائبریری", value: "lm" },
  { label: "نیو ڈورپ لائبریری", value: "nd" },
  { label: "اوٹینڈوفر لائبریری", value: "ot" },
  { label: "پارک چیسٹر لائبریری", value: "pk" },
  { label: "پیلہم بے لائبریری", value: "pm" },
  { label: "پیلہم پارک وے – وین نیسٹ لائبریری", value: "vn" },
  { label: "پورٹ رچمنڈ لائبریری", value: "pr" },
  { label: "رچمنڈ ٹاؤن لائبریری", value: "rt" },
  { label: "ریورڈیل لائبریری", value: "rd" },
  { label: "دریا کے کنارے لائبریری", value: "rs" },
  { label: "روزویلٹ جزیرہ لائبریری", value: "ri" },
  { label: "شومبرگ سینٹر فار ریسرچ ان بلیک کلچر", value: "sc" },
  { label: "سیڈگوک لائبریری", value: "sd" },
  { label: "سیورڈ پارک لائبریری", value: "se" },
  { label: "ساؤنڈ ویو لائبریری", value: "sv" },
  { label: "ساؤتھ بیچ لائبریری", value: "sb" },
  { label: "سینٹ ایگنیس لائبریری", value: "sa" },
  { label: "سینٹ جارج لائبریری سینٹر", value: "sg" },
  { label: "Stavros Niarchos فاؤنڈیشن لائبریری (SNFL)", value: "sn" },
  { label: "سٹیپلٹن لائبریری", value: "st" },
  { label: "سٹیفن اے شوارزمین بلڈنگ", value: "ma" },
  { label: "سپوٹین ڈیویل لائبریری", value: "dy" },
  { label: "ٹیرنس کارڈینل کوک – کیتھیڈرل لائبریری", value: "ca" },
  {
    label: "پرفارمنگ آرٹس کے لیے نیویارک پبلک لائبریری",
    value: "my",
  },
  { label: "تھروگس نیک لائبریری", value: "tg" },
  { label: "Todt Hill-Westerleigh لائبریری", value: "th" },
  { label: "ٹامپکنز اسکوائر لائبریری", value: "ts" },
  { label: "ٹوٹن ویل لائبریری", value: "tv" },
  { label: "ٹریمونٹ لائبریری", value: "tm" },
  { label: "وین کورٹلینڈ لائبریری", value: "vc" },
  { label: "ویک فیلڈ لائبریری", value: "wk" },
  { label: "واشنگٹن ہائٹس لائبریری", value: "wh" },
  { label: "ویبسٹر لائبریری", value: "wb" },
  { label: "ویسٹ فارمز لائبریری", value: "wf" },
  { label: "ویسٹ نیو برائٹن لائبریری", value: "nb" },
  { label: "ویسٹ چیسٹر اسکوائر لائبریری", value: "wt" },
  { label: "ووڈلان ہائٹس لائبریری", value: "wl" },
  { label: "ووڈ اسٹاک لائبریری", value: "wo" },
  { label: "یارک ویل لائبریری", value: "yv" },
];

export default libraryUr;
