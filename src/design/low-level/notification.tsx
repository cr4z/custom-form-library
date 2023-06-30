import usePalette from "../../hooks/usePalette";
import { SessionStatus } from "../../session-sdk";
import { BORDER_RADIUSES } from "../borderRadiuses";
import Box from "../components-dev/BoxExtended";
import { getSizing } from "../sizing";

export type NotificationStatus = "Danger" | "Warning" | "Success" | "Info";
export type NotificationSize = "compact" | "default";

interface IXNGNotification {
  children?: React.ReactNode;
  status?: NotificationStatus | SessionStatus;
  size?: NotificationSize;
  useBadge?: boolean;
  fullHeight?: boolean;
}

function XNGNotification(props: IXNGNotification) {
  const palette = usePalette();

  let color = "";
  let bgcolor = "";

  const status = props.status !== undefined ? props.status : "Info";
  switch (status) {
    // Gray
    case SessionStatus.NUMBER_0:
      color = palette.contrasts[0];
      bgcolor = palette.contrasts[3];
      break;
    // Yellow
    case SessionStatus.NUMBER_1:
    case "Warning":
      color = palette.warning[0];
      bgcolor = palette.warning[3];
      break;
    // Blue
    case SessionStatus.NUMBER_2:
    case "Info":
      color = palette.primary[1];
      bgcolor = palette.primary[3];
      break;
    // Red
    case SessionStatus.NUMBER_3:
    case "Danger":
      color = palette.danger[1];
      bgcolor = palette.danger[3];
      break;
    // Green
    case SessionStatus.NUMBER_4:
    case "Success":
      color = palette.success[1];
      bgcolor = palette.success[3];
      break;
    // Purple
    case SessionStatus.NUMBER_5:
      color = palette.secondary[1];
      bgcolor = palette.secondary[3];
  }

  return (
    <Box
      sx={{
        borderRadius: BORDER_RADIUSES[0],
        bgcolor: bgcolor,
        color: color,
        minHeight: props.fullHeight ? "100%" : props.size === "compact" ? "unset" : getSizing(5),
        height: props.size === "compact" ? (props.fullHeight ? getSizing(2) : 0) : "min-content",
        overflow: "hidden",
        display: "flex",
        paddingX: getSizing(1),
        paddingY: getSizing(1),
        width: "100%",
        textAlign: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          minWidth: "8px",
          minHeight: "8px",
          borderRadius: 999,
          bgcolor: color,
          marginRight: getSizing(1),
        }}
      ></Box>
      {props.children}
    </Box>
  );
}

export default XNGNotification;
