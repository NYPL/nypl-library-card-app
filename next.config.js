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
};
