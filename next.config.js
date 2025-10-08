require("newrelic");

const { i18n } = require("./next-i18next.config");

const PROD_BUILD_ID = "production-1.2.6-2";

console.info("PROD_BUILD_ID: ", PROD_BUILD_ID);

module.exports = {
  basePath: "/library-card",
  // Configures the app's locale settings.
  i18n,
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/library-card/",
        destination: "/library-card/new",
        permanent: true,
      },
    ];
  },
  generateBuildId: async () => `${PROD_BUILD_ID}`,
};
