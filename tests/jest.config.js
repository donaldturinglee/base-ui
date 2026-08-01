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
    // D3 ships as modules only, and node_modules is left untransformed by default, so the
    // chart's imports would arrive as syntax jest cannot read. Only D3 and what it is built
    // from are let through
    transformIgnorePatterns: [
        "node_modules/(?!(d3|d3-[a-z0-9-]+|internmap|delaunator|robust-predicates)/)",
    ],
};
