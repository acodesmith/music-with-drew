import { isServer } from "./server";

export const THEME_LIGHT = "Light";
export const THEME_DARK = "Dark";
export const THEME_STORAGE_KEY = "theme";

/**
 * Return Theme from the OS
 */
export const getOSTheme = () =>
  isServer
    ? THEME_DARK
    : window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ? THEME_DARK
    : THEME_LIGHT;

/**
 * Return OS Theme or the user defined theme via local storage
 * @returns {*}
 */
export const getTheme = () => {
  if (isServer) {
    return THEME_DARK;
  }

  const theme = window.localStorage.getItem(THEME_STORAGE_KEY);

  return theme || getOSTheme();
};

const userTheme = getTheme();

export const theme = (lightClassName, darkClassName) =>
  userTheme === THEME_DARK ? darkClassName : lightClassName;

export const inversedTheme =
  userTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;

export const flipTheme = () => {
  if (!isServer) window.localStorage.setItem(THEME_STORAGE_KEY, inversedTheme);
};
