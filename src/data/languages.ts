// Language data for the language menu.
export type LanguageData = {
  charCode: string;
  englishLabel: string;
  nativeLabel: string | undefined;
  langCode: string;
};

export const languageData: LanguageData[] = [
  {
    charCode: "ar",
    englishLabel: "Arabic",
    nativeLabel: "العَرَبِية",
    langCode: "ar",
  },
  {
    charCode: "bn",
    englishLabel: "Bengali",
    nativeLabel: "বাঙালি",
    langCode: "bn",
  },
  {
    charCode: "zhcn",
    englishLabel: "Chinese (Simplified)",
    nativeLabel: "简体中文",
    langCode: "zh-cn",
  },
  {
    charCode: "en",
    englishLabel: "English",
    nativeLabel: undefined,
    langCode: "en",
  },
  {
    charCode: "fr",
    englishLabel: "French",
    nativeLabel: "Français",
    langCode: "fr",
  },
  {
    charCode: "ht",
    englishLabel: "Haitian Creole",
    nativeLabel: "Kreyòl Ayisyen",
    langCode: "ht",
  },
  {
    charCode: "ko",
    englishLabel: "Korean",
    nativeLabel: "한국어",
    langCode: "ko",
  },
  {
    charCode: "pl",
    englishLabel: "Polish",
    nativeLabel: "Polski",
    langCode: "pl",
  },
  {
    charCode: "ru",
    englishLabel: "Russian",
    nativeLabel: "Русский",
    langCode: "ru",
  },
  {
    charCode: "es",
    englishLabel: "Spanish",
    nativeLabel: "Español",
    langCode: "es",
  },
  {
    charCode: "ur",
    englishLabel: "Urdu",
    nativeLabel: "اُردُو",
    langCode: "ur",
  },
];
