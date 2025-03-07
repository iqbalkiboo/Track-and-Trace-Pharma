import type { GlobalTheme, GlobalThemeOverrides } from "naive-ui"

export const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: "#0b8f9d",
    primaryColorHover: "#17A5B5",
    primaryColorPressed: "#0A7F8C",
    primaryColorSuppl: "#0b8f9d",
    fontSize: "16px",
  },
  Input: {
    heightLarge: "56px",
    fontSizeLarge: "20px",
  },
}

export const theme = ref<GlobalTheme | null>(null)
