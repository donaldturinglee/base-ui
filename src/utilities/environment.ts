import { version } from "react";

const canUseDOM = !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
);

// Grab the major version from react. This could be formatted as any valid
// semver version, e.g.:
//
// - 19.0.0
// - 19.0.0-rc.1
// - 0.0.0-{channel}-{commit}-{time}
//
// So we only pull the first part of the version and parse it.
const reactVersion = version.split(".");
const reactMajorVersion = parseInt(reactVersion[0], 10);

const EXPERIMENTAL_REACT_VERSION_REGEX = /^0\.0\.0-experimental-[a-f0-9]{8}-\d{8}$/;
const isExperimentalReactVersion = EXPERIMENTAL_REACT_VERSION_REGEX.test(version);

export { canUseDOM, reactMajorVersion, isExperimentalReactVersion };
