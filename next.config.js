module.exports = {
  webpack: (config, { isServer, webpack }) => {
    // react-axe should only be bundled when TEST_AXE_ENV=true
    !process.env.TEST_AXE_ENV &&
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
