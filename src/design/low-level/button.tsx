import { Button, SxProps, Typography } from "@mui/material";
import { XNGButtonSize, getButtonHeight } from "./button_types";
import usePalette from "../hooks/usePalette";

type XNGButtonType = "outline" | "filled";

interface IXNGButton {
  onClick?: () => void;
  children?: React.ReactNode;
  variant?: XNGButtonType;
  to?: string;
  size?: XNGButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  sx?: SxProps;
}
function XNGButton(props: IXNGButton) {
  const VARIANT: XNGButtonType = props.variant ? props.variant : "filled";
  const HEIGHT = props.size ? getButtonHeight(props.size) : getButtonHeight("default");
  const palette = usePalette();
  const STYLE = props.sx ? props.sx : ({} as SxProps);

  const BTN = (
    <Button
      onClick={() => {
        if (props.onClick) props.onClick();
      }}
      {...(props.fullWidth ? { fullWidth: props.fullWidth } : {})}
      sx={{
        boxShadow: "none",
        height: HEIGHT,
        ":hover": {
          bgcolor: VARIANT === "filled" ? palette.primary[1] : "initial",
          borderColor: palette.primary[2],
        },
        bgcolor: VARIANT === "filled" ? palette.primary[2] : palette.contrasts[5],
        borderColor: palette.primary[2],
        color: VARIANT === "filled" ? palette.contrasts[5] : palette.primary[2],
        ...STYLE,
      }}
      variant={VARIANT === "filled" ? "contained" : "outlined"}
    >
      <Typography sx={{ textTransform: "initial" }}>{props.children}</Typography>
    </Button>
  );

  return BTN;
}

export default XNGButton;
