const { NEXT_PUBLIC_USE_AXE, ASSET_PREFIX } = process.env;

module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/library-card/new",
        permanent: true,
      },
      {
        source: "/library-card",
        destination: "/library-card/new",
        permanent: true,
      },
    ];
  },
  assetPrefix: ASSET_PREFIX,
  async rewrites() {
    return [
      {
        source: `/library-card/${ASSET_PREFIX}/_next/:path*`,
        destination: "/_next/:path*",
      },
      {
        source: `/${ASSET_PREFIX}/_next/:path*`,
        destination: "/_next/:path*",
      },
    ];
  },
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
