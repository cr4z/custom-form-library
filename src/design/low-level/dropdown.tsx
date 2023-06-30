import Box from "../components-dev/BoxExtended";
import { getSizing } from "../sizing";
import { XNGButtonSize, getButtonHeight } from "./button_types";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { SxProps } from "@mui/material";

export interface ISelect {
  size?: XNGButtonSize;
  options: string[];
  value: string;
  title?: string;
  handle: any;
  sx?: SxProps;
}

function XNGSelect(props: ISelect) {
  const SIZE: XNGButtonSize = props.size ? props.size : "default";
  const HEIGHT = getButtonHeight(SIZE);
  const STYLE = props.sx ? props.sx : ({} as SxProps);

  return (
    <Box sx={{ position: "relative", minWidth: getSizing(15), ...STYLE }}>
      <FormControl fullWidth>
        <Select
          style={{ height: HEIGHT }}
          name="dropdown"
          value={props.value}
          onChange={props.handle}
          displayEmpty
        >
          {props.title ? (
            <MenuItem disabled value="">
              {props.title}
            </MenuItem>
          ) : null}
          {props.options.map((d: any, index: number) => {
            return (
              <MenuItem key={index} value={d}>
                {d}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}

export default XNGSelect;
