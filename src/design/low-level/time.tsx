import * as React from 'react';
import { Dayjs } from 'dayjs';
import  dayjs  from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { XNGButtonSize } from './button_types';
import { TextField } from '@mui/material';
import { getSizing } from '../sizing';

interface IXNGTimePicker {
  title?: string;
  size?: XNGButtonSize;
  setValue: React.Dispatch<React.SetStateAction<Dayjs | null>>;
  }

export default function XNGTimePicker(props : IXNGTimePicker) {
  const [value, setValue] = React.useState<Dayjs | null>(null);
  const TITLE = props.title ? props.title : "Time"
  


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker renderInput={(params) => <TextField sx={{"width":getSizing(18)}} {...params} inputProps={{...params.inputProps, placeholder:TITLE,}}/>} value={value} onChange={(newValue) => { setValue(newValue); props.setValue!(newValue)}} />
    </LocalizationProvider>
  );
}

