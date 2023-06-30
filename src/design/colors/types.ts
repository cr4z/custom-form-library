type FourHexVariants = { 0: string; 1: string; 2: string; 3: string };

export type XLogsPalette = {
  primary: FourHexVariants;
  secondary: FourHexVariants;
  success: FourHexVariants;
  warning: FourHexVariants;
  danger: FourHexVariants;
  info: FourHexVariants;
  menu: FourHexVariants;
  disabled: string;
  contrasts: { 0: string; 1: string; 2: string; 3: string; 4: string; 5: string };
}

export enum XNGTheme {
  Light,
}
