import { createInstance } from "i18next";
import path from "path";
import fs from "fs";

const SUPPORTED_LANGS = [
  "ar",
  "bn",
  "en",
  "es",
  "fr",
  "ht",
  "ko",
  "pl",
  "ru",
  "ur",
  "zhcn",
];

export const getT = async (lang = "en") => {
  const safeLang = SUPPORTED_LANGS.includes(lang) ? lang : "en";

  const translations = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "public/locales", safeLang, "common.json"),
      "utf-8"
    )
  );

  const i18n = createInstance();
  await i18n.init({
    lng: safeLang,
    fallbackLng: "en",
    defaultNS: "common",
    resources: { [safeLang]: { common: translations } },
  });

  return i18n.t.bind(i18n);
};
