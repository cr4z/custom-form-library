import ZINDEX_LAYERS from "../../constants/zIndexLayers";
import usePalette from "../../hooks/usePalette";
import Box from "../components-dev/BoxExtended";
import { getSizing } from "../sizing";
import { Checkbox, IconButton } from "@mui/material";

interface IXNGCheckbox {
  checked: boolean;
  onToggle: () => void;
}
function XNGCheckbox(props: IXNGCheckbox) {
  const palette = usePalette();

  return (
    <Box
      sx={{
        position: "relative",
        svg: { color: palette.contrasts[3] },
        ".Mui-checked": {
          svg: {
            color: palette.primary[2],
          },
        },
        ".Mui-checked:hover": {
          bgcolor: "unset",
        },
      }}
    >
      <IconButton>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            maxWidth: getSizing(3),
            maxHeight: getSizing(3),
            zIndex: ZINDEX_LAYERS.xngCheckboxRipple,
          }}
        >
          <Checkbox
            sx={{ ".MuiTouchRipple-root": { display: "none" }, zIndex: ZINDEX_LAYERS.xngCheckbox }}
            checked={props.checked}
            onClick={() => props.onToggle()}
          />
        </Box>
      </IconButton>
    </Box>
  );
}

export default XNGCheckbox;
