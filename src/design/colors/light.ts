import { XLogsPalette } from "./types";

export const THEMES = {
  light: {
    primary: { 3: "#96B7C0", 2: "#206A7E", 1: "#075970", 0: "#053E4E" },
    secondary: { 3: "#CDBEDC", 2: "#8B68AC", 1: "#43166E", 0: "#2D0653" },
    success: { 3: "#B2DBBF", 2: "#68C183", 1: "#117930", 0: "#005B1C" },
    warning: { 3: "#FFEEC4", 2: "#EACD88", 1: "#CBA54D", 0: "#9E803B" },
    danger: { 3: "#FF9789", 2: "#E16555", 1: "#A42717", 0: "#7C0E00" },
    info: { 3: "#DBE6E8", 2: "#475B6B", 1: "#2B3947", 0: "#1B2839" },
    menu: { 3: "#929AAC", 2: "#797c82", 1: "", 0: "#2B303B" },
    disabled: "#B6B6B6",
    contrasts: {
      0: "#212121",
      1: "#4B4B4B",
      2: "#757575",
      3: "#E0E0E0",
      4: "#F4F4F4",
      5: "#FFFFFF",
    },
  } as XLogsPalette,
};
