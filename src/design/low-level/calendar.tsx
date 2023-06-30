import * as React from 'react';
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';
import { XNGButtonSize } from './button_types';
import Box from '../components-dev/BoxExtended';

interface IXNGDatePicker { 
  title?: string;
  size?: XNGButtonSize;
  setValue: React.Dispatch<React.SetStateAction<Dayjs | null>>;
  }

export default function XNGDatePicker(props : IXNGDatePicker) {
  const [value, setValue] = React.useState<Dayjs | null>(null);
  const TITLE = props.title ? props.title : "MM/DD/YYYY"

  return (
    <Box>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker renderInput={(params) => <TextField size='small' sx={{"&.MuiInputBase-Input": {height: "40px"}}} {...params} inputProps={{...params.inputProps, placeholder:TITLE,}}/>} value={value} onChange={(newValue) => {setValue(newValue); props.setValue!(newValue)}} />
    </LocalizationProvider>
    </Box>
  );
}
