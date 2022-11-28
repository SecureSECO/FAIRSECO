/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleDirectories: ["node_modules"],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
        "^.+\\.(js)$": "babel-jest",
    },
    transformIgnorePatterns: [],
    globalSetup: "./src/global_setup.ts",
};
