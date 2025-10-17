require("newrelic");

const { i18n } = require("./next-i18next.config");
const pkg = require("./package.json");

const CURRENT_APP_VERSION = pkg.version;

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
    let buildIdFromEnv = process.env.NEXT_BUILD_ID;
    if (buildIdFromEnv) {
      buildIdFromEnv += `-${CURRENT_APP_VERSION}`;

      console.info(`NEXT_BUILD_ID: ${buildIdFromEnv}`);
      return buildIdFromEnv;
    }
    console.warn(
      `Warning: NEXT_BUILD_ID is missing in env, using package.json ${CURRENT_APP_VERSION} version as build ID\n`
    );
    return CURRENT_APP_VERSION;
  },
};
