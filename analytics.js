// Account codes for Google Analytics for different environments
const google = {
  code(isProd) {
    const codes = {
      production: 'UA-1420324-3',
      dev: 'UA-1420324-122',
    };
    return isProd ? codes.production : codes.dev;
  },
};

export default {
  google,
};
