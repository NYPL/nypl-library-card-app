import { createInstance } from "i18next";
import path from "path";
import fs from "fs";
const { i18n: i18nConfig } = require("../../next-i18next.config");

/**
 * getT
 * Returns a i18next `t` function for the given language, loaded directly
 * from the locale JSON files on disk. This is the server-side equivalent
 * of the `useTranslation` hook from next-i18next, for use in API routes
 * and other non-React contexts where hooks are not available.
 * @param lang - The language code to load translations for. Defaults to "en".
 * Falls back to "en" if the language is not in the supported locales list.
 */
export const getT = async (lang = "en") => {
  const normalizedLang = lang === "zhcn" ? "zh-cn" : lang;
  const safeLang = i18nConfig.locales.includes(lang) ? normalizedLang : "en";

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
