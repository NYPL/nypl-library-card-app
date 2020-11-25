const { NEXT_PUBLIC_USE_AXE } = process.env;

const PROD_BUILD_ID =
  "production-0.6.0-f0e06871ce70a61766234bebb46ab0bdd81b8787";

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
    // react-axe should only be bundled when NEXT_PUBLIC_USE_AXE=true
    !NEXT_PUBLIC_USE_AXE &&
      config.plugins.push(new webpack.IgnorePlugin(/react-axe$/));
    // Fixes npm packages that depend on `fs` module since
    // we can't depend on this in the client-side code.
    if (!isServer) {
      config.node = {
        fs: "empty",
      };
    }

    return config;
  },
};
