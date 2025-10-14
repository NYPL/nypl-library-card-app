require("newrelic");

const { i18n } = require("./next-i18next.config");
const pkg = require("./package.json");

const BUILD_ID = pkg.version;

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
  generateBuildId: async () => {
    if (process.env.NEXT_BUILD_ID) {
      console.info(`NEXT_BUILD_ID: ${process.env.NEXT_BUILD_ID}`);
      return process.env.NEXT_BUILD_ID;
    }
    console.warn(
      `Warning: NEXT_BUILD_ID is missing in env, using package.json ${BUILD_ID} version as build ID\n`
    );
    return BUILD_ID;
  },
};
