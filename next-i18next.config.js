// next-i18next.config.js
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es", "fr", "de"],
  },
  ns: ["common"],
  pages: {
    "*": ["common"],
  },
  localePath: path.resolve("./public/locales"),
  defaultNS: "common",
  react: {
    useSuspense: true,
  },
};
