const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es", "fr", "de"],
  },
  localePath: path.resolve("./public/locales"),
  react: {
    useSuspense: false,
  },
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      common: require("./public/locales/en/common.json"),
    },
  },
};
