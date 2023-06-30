import { DatePicker } from "@mui/x-date-pickers";
import { Control, Controller, FieldValues, Path, PathValue } from "react-hook-form";
import { TextField } from "@mui/material";
import Box from "../components-dev/BoxExtended";
import { XNGErrorFeedback } from "./_error";

type IXNGFormDatePicker<T extends FieldValues> = {
  control: Control<T, any>;
  name: Path<T>;
  label: string;
  defaultValue: Date;
  useError?: { message: string | undefined };
  disabled?: boolean;
};

function XNGFormDatePicker<T extends FieldValues>(props: IXNGFormDatePicker<T>) {
  const _ = (
    <Controller
      control={props.control}
      name={props.name}
      defaultValue={
        props.defaultValue ? (props.defaultValue as PathValue<T, Path<T>>) : (null as PathValue<T, Path<T>>)
      } // forces to default to current date
      render={({ field: { value, onChange } }) => (
        <DatePicker
          onChange={onChange}
          disabled={props.disabled}
          value={value ? value : null}
          renderInput={(params) => (
            <TextField value={value} fullWidth size="small" {...params} label={props.label} />
          )}
        />
      )}
    />
  );

  return props.useError ? (
    <Box>
      {_}
      <XNGErrorFeedback error={props.useError.message} />
    </Box>
  ) : (
    _
  );
}

export default XNGFormDatePicker;
