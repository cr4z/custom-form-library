import * as React from 'react';
import Switch from '@mui/material/Switch';
import { SxProps, TextField, useTheme } from "@mui/material";
import usePalette from "../../hooks/usePalette";
import { getSizing } from "../sizing";
import Box from '../components-dev/BoxExtended';

interface IXNGSwitch {
    sx?: SxProps;
    size?: "small" | "medium"
  }


export default function XNGSwitch(props: IXNGSwitch) {
  const thm = useTheme();
  const palette = usePalette();
  const SIZE = props.size ? props.size : "medium";
  const STYLE = props.sx ? props.sx : {} as SxProps;
 
  return (
    <Box sx={{...STYLE}}>
      <Switch  defaultChecked size={SIZE} />
    </Box>
  );
}
