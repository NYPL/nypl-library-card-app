process.env.IPSTACK_KEY = "some-key";

module.exports = {
  prettierPath: null,
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  setupFilesAfterEnv: ["<rootDir>/testHelper/browser.ts"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    ".spec",
    "/__tests__/fixtures/*",
  ],
  // A map from regular expressions to paths to transformers
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  moduleNameMapper: {
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
  },
  testEnvironment: "jsdom",
};
