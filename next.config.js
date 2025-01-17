// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require("./next-i18next.config");

const PROD_BUILD_ID = "production-0.10.1-bbf78d0";

module.exports = {
  basePath: "/library-card",
  // Configures the app's locale settings.
  i18n,
  async redirects () {
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
