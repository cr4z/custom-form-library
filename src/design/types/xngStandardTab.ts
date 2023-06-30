export type XNGStandardTab = {
  id?: number;
  label?: string | JSX.Element;
  onClick?: () => void;
  navTo?: string;
  icon?: JSX.Element;
  unclickable?: boolean;
};
