module.exports = {
  webpack: (config, { isServer, webpack }) => {
    // react-axe should only be bundled when NEXT_PUBLIC_USE_AXE=true
    !process.env.NEXT_PUBLIC_USE_AXE &&
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
  async redirects() {
    return [
      {
        source: "/",
        destination: "/library-card/new",
        permanent: true,
      },
    ];
  },
};
