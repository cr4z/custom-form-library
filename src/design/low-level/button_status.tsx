import { Typography, ButtonBase } from "@mui/material";
import { getSizing } from "../../design/sizing";
import Box from "../../design/components-dev/BoxExtended";
import usePalette from "../../hooks/usePalette";
import { BORDER_RADIUSES } from "../../design/borderRadiuses";
import { XNGICONS, XNGIconRenderer } from "../../design/icons";

export type StatusButtonStatus = "Success" | "Default" | "Danger";

export interface IXNGStatusButton {
  status?: StatusButtonStatus;
  label?: string;
  fullWidth?: boolean;
  isHighlighted?: boolean;
  onClick?: () => void;
}
function XNGStatusButton(props: IXNGStatusButton) {
  const palette = usePalette();

  const icon =
    props.status === "Success" ? <XNGIconRenderer i={<XNGICONS.SmallCheck />} size="lg" /> : null;

  return (
    <ButtonBase
      sx={{
        ...(props.fullWidth ? { width: "100%" } : {}),
        borderRadius: BORDER_RADIUSES[0],
        overflow: "hidden",
      }}
      {...(props.onClick ? { onClick: props.onClick } : {})}
    >
      <Box
        sx={{
          display: "flex",
          bgcolor: props.isHighlighted ? palette.primary[3] : palette.contrasts[5],
          ...(props.fullWidth ? { width: "100%" } : {}),
        }}
        className="noselect"
      >
        <Box
          sx={{
            width: getSizing(3),
            height: getSizing(3),
            border: "1px solid " + palette.contrasts[3],
            borderTopLeftRadius: BORDER_RADIUSES[0],
            borderBottomLeftRadius: BORDER_RADIUSES[0],
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {icon}
        </Box>
        <Box
          sx={{
            paddingLeft: getSizing(1),
            border: "1px solid " + palette.contrasts[3],
            borderLeft: "none",
            borderTopRightRadius: BORDER_RADIUSES[0],
            borderBottomRightRadius: BORDER_RADIUSES[0],
            ...(props.fullWidth ? { width: "100%" } : {}),
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" sx={{ textAlign: "left" }}>
            {props.label}
          </Typography>
        </Box>
      </Box>
    </ButtonBase>
  );
}

export default XNGStatusButton;
