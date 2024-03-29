/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  moduleNameMapper: {
    "actions/(.*)": "<rootDir>/src/actions/$1",
    "business/(.*)": "<rootDir>/src/core/modules/$1",
    "constants/(.*)": "<rootDir>/src/constants/$1",
    "features/(.*)": "<rootDir>/src/features/$1",
    "reducers/(.*)": "<rootDir>/src/reducers/$1",
    "shared/(.*)": "<rootDir>/src/shared/$1",
    "\\.(css|scss)$": "identity-obj-proxy",
  },
  testEnvironment: "jsdom",
  verbose: true,
};

module.exports = config;
