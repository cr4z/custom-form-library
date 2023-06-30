import { Typography } from "@mui/material";
import Box from "../../../../components-dev/BoxExtended";
import { getSizing } from "../../../../sizing";
import { Dayjs } from "dayjs";
import { Tooltip, IconButton } from "@mui/material";
import usePalette from "../../../../../hooks/usePalette";
import XNGBadge from "../../../../low-level/badge";
import XNGButton from "../../../../low-level/button";
import { useState } from "react";

export function NotificationItem(props: {
  text: string;
  date: Dayjs;
  unread: boolean;
  onYes?: () => void;
  onNo?: () => void;
  onRead: () => void;
}) {
  const palette = usePalette();
  const howLongAgo = props.date.fromNow().charAt(0).toLocaleUpperCase() + props.date.fromNow().substring(1);
  const [read, setRead] = useState<boolean>(props.unread);
  return (
    <Box
      sx={{
        paddingY: getSizing(1),
        display: "flex",
        gap: getSizing(1),
        ":hover": { bgcolor: palette.contrasts[4], cursor: "pointer" },
      }}
      className="noselect"
    >
      <Box sx={{ width: getSizing(43), paddingLeft: getSizing(2) }}>
        <Typography variant="body2" sx={{ textAlign: "left" }}>
          {props.text}
          <Typography color={palette.contrasts[2]} variant="body2" sx={{ display: "inline" }}>
            {" " + howLongAgo}
          </Typography>
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: getSizing(2),
            marginTop: props.onYes ? getSizing(2) : 0,
            marginBottom: getSizing(1),
          }}
        >
          {props.onNo && (
            <XNGButton onClick={() => props.onNo!()} variant="outline">
              No
            </XNGButton>
          )}
          {props.onYes && <XNGButton onClick={() => props.onYes!()}>Yes</XNGButton>}
        </Box>
      </Box>
      {read && (
        <Box sx={{ width: getSizing(5), height: getSizing(5) }}>
          <Tooltip title="Mark as read">
            <IconButton onClick={() => {props.onRead(); setRead(false)}} sx={{ padding: getSizing(1.5) }}>
              <XNGBadge status="Default" />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
}
