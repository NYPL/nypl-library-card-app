const path = require("path");
const localePath = path.resolve("./public/locales");

console.log("Loading locales from:", localePath);

module.exports = {
  localePath: localePath,
  i18n: {
    defaultLocale: "en",
    locales: [
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
      "zh-cn",
    ],
  },
};
