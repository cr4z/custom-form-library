import { Switch } from "@mui/material";
import Box from "../components-dev/BoxExtended";
import usePalette from "../../hooks/usePalette";
import { Typography } from "@mui/material";
import { getSizing } from "../sizing";

interface IXNGToggle {
  value: boolean;
  onToggle: () => void;
  label?: string;
}
function XNGToggle(props: IXNGToggle) {
  const palette = usePalette();

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", gap: getSizing(1), cursor: "pointer" }}
      onClick={() => (props.onToggle ? props.onToggle() : {})}
    >
      <Box
        sx={{
          // give pill shape
          ".MuiSwitch-track": {
            borderRadius: 999,
            bgcolor: palette.contrasts[2],
          },
          ".MuiSwitch-root": {
            padding: "7px",
            width: "56px",
            height: "36px",
          },
          ".MuiSwitch-thumb": {
            width: "18px",
            height: "18px",
          },
          // remove confusing margins using viewport method
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          maxHeight: "24px",
          maxWidth: "45px",
          // add color
          ".Mui-checked": {
            color: palette.primary[2] + "!important",
          },
          ".Mui-checked+.MuiSwitch-track": {
            bgcolor: palette.primary[2] + "!important",
          },
        }}
      >
        <Switch checked={props.value} />
      </Box>
      <Typography className="noselect">{props.label}</Typography>
    </Box>
  );
}

export default XNGToggle;
