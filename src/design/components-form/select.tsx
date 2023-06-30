import { Controller, FieldValues, UseFormWatch, UseFormSetValue, Path, PathValue } from "react-hook-form";
import { TextField, MenuItem, FormControl, Menu } from "@mui/material";
import { XNGErrorFeedback } from "./_error";
import Box from "../components-dev/BoxExtended";
import { useState } from "react";

export type IXNGFormSelect<T extends FieldValues, V> = {
  control: any;
  name: Path<T>;
  items: V[];
  label: string;
  /** Default value is required by design. This is the only way to render no selected value while remaining a controlled component. If you don't intend to use one of your options as a default value, pass the Default<T> variant of your object here. (I.E., JSONs become {}, strings become "")*/
  defaultValue?: V;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  useError?: { message: string | undefined };
  getOptionLabel: (option: V) => string;
  getOptionCallback?: (option: V) => void;
};

export function XNGFormSelect<T extends FieldValues, V>(props: IXNGFormSelect<T, V>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function setFormValue(item: V) {
    props.setValue(props.name, item as PathValue<T, Path<T>>);
  }
  function getSelectedOptionDisplayValue() {
    if (!props.watch(props.name)) {
      return;
    }
    return props.getOptionLabel(props.watch(props.name));
  }

  const _ = (
    <Controller
      control={props.control}
      name={props.name}
      defaultValue={props.items[0] as PathValue<T, Path<T>>}
      render={() => (
        <FormControl fullWidth>
          <Box onClick={handleClick} sx={{ cursor: "pointer" }}>
            <TextField
              fullWidth
              size="small"
              select
              sx={{ pointerEvents: "none" }}
              label={props.label}
              value={getSelectedOptionDisplayValue()}
            >
              {/* This is NOT for display, it's here to provide values to the MUI TextField since they don't provide an intuitive way to do so like an attribute. Sorry for the lack of clarity here. */}
              {/* These ARE the values used for the closed-select's input display, however. */}
              {props.items.map((item, i) => {
                // assign value as indexer
                return (
                  <MenuItem key={i} value={props.getOptionLabel(item)}>
                    {props.getOptionLabel(item)}
                  </MenuItem>
                );
              })}
            </TextField>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={anchorEl !== null}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            {props.items.map((item, i) => {
              return (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    setFormValue(item);
                    if (props.getOptionCallback) {
                      props.getOptionCallback(item);
                    }
                  }}
                  key={i}
                  value={i}
                >
                  {props.getOptionLabel(item)}
                </MenuItem>
              );
            })}
          </Menu>
        </FormControl>
      )}
    />
  );

  return props.useError ? (
    <Box sx={{ width: "100%" }}>
      {_}
      <Box>
        <XNGErrorFeedback error={props.useError.message} />
      </Box>
    </Box>
  ) : (
    _
  );
}
