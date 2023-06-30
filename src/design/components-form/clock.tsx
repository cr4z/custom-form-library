import { TextField } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { Control, Controller, FieldValues, Path, PathValue, UseFormWatch } from "react-hook-form";
import { getSizing } from "../sizing";
import { Dayjs } from "dayjs";

type IXNGClock<T extends FieldValues> = {
  control: Control<T, any>;
  label: string;
  name: Path<T>;
  watch: UseFormWatch<T>;
  onAfterChange?: (e: Date | null) => void;
  defaultValue?: Dayjs;
};

export function XNGClockInput<T extends FieldValues>(props: IXNGClock<T>) {
  return (
    <Controller
      control={props.control}
      name={props.name}
      defaultValue={
        props.defaultValue ? (props.defaultValue as PathValue<T, Path<T>>) : (null as PathValue<T, Path<T>>)
      } // forces to default to current date
      render={({ field: { onChange } }) => (
        <TimePicker
          label={props.label}
          value={props.watch(props.name)}
          onChange={(e: Date | null) => {
            onChange(e);
            if (props.onAfterChange) {
              props.onAfterChange(e);
            }
          }}
          renderInput={(params: any) => (
            <TextField
              fullWidth
              sx={{
                minWidth: getSizing(15),
                ".MuiInputBase-root": { padding: 0 },
                button: { transform: `translateX(${getSizing(-1.5)})` },
              }}
              size="small"
              {...params}
            />
          )}
        />
      )}
    />
  );
}
