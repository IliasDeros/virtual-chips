/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  moduleNameMapper: {
    "actions/": "<rootDir>/src/actions/",
    "business/(.*)": "<rootDir>/src/core/modules/$1",
    "constants/(.*)": "<rootDir>/src/constants/$1",
    "features/(.*)": "<rootDir>/src/features/$1",
    "reducers/(.*)": "<rootDir>/src/reducers/$1",
    "shared/(.*)": "<rootDir>/src/shared/$1",
  },
  verbose: true,
};

module.exports = config;
