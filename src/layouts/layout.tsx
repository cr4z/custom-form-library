import { SxProps } from "@mui/material";
import usePalette from "../design/hooks/usePalette";
import { getSizing } from "../design/sizing";
import Box from "../design/components-dev/BoxExtended";
import { BORDER_RADIUSES } from "../design/borderRadiuses";
import XNGButton from "../design/low-level/button";

export const HEADER_SIZE = "h5";
export const SUBHEADER_SIZE = "h6";

export const BLUE_BACKGROUND: SxProps = {
  // background: "rgb(213,226,230)",
  background:
    "linear-gradient(135deg, rgba(5,62,78,1) 0%, rgba(7,89,112,1) 32%, rgba(150,183,192,1) 64%, rgba(213,226,230,1) 100%)",
  height: "100%",
};

export function FloatingLayout(props: { children: React.ReactNode }) {
  const palette = usePalette();

  return (
    <Box sx={{ height: getSizing(100) }}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Box
          sx={{
            padding: getSizing(4),
            paddingTop: getSizing(5),
            bgcolor: palette.contrasts[5],
            borderRadius: BORDER_RADIUSES[0],
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: getSizing(60),
            }}
          >
            {props.children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export function NextButtonJustifiedRight(props: {
  onNext: () => void;
  onSkip?: () => void;
  overrideText?: string;
}) {
  const OVERRIDE_TEXT = props.overrideText ?? "Next";
  return (
    <Box sx={{ paddingTop: getSizing(2), display: "flex", justifyContent: "flex-end", gap: getSizing(2) }}>
      {props.onSkip && (
        <XNGButton variant="outline" onClick={() => props.onSkip!()}>
          Skip
        </XNGButton>
      )}
      <XNGButton onClick={() => props.onNext()}>{OVERRIDE_TEXT}</XNGButton>
    </Box>
  );
}
