// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require("./next-i18next.config");

const { NEXT_PUBLIC_USE_AXE } = process.env;

const PROD_BUILD_ID =
  "production-0.7.11-bdcdaade644171606ca2b3b1d23ba2560181855a";

module.exports = {
  basePath: "/library-card",
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
  webpack: (config, { isServer, webpack }) => {
    // @axe-core/react should only be bundled when NEXT_PUBLIC_USE_AXE=true
    !(NEXT_PUBLIC_USE_AXE === "true") &&
      config.plugins.push(new webpack.IgnorePlugin(/@axe-core\/react$/));
    // Fixes npm packages that depend on `fs` module since
    // we can't depend on this in the client-side code.
    if (!isServer) {
      config.node = {
        fs: "empty",
      };
    }

    return config;
  },
  i18n,
};
