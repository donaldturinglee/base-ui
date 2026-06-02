module.exports = {
    rootDir: "../",
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.js"],
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
    transform: {
        "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
    },
};
