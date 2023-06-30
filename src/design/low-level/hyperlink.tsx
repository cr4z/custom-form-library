import { Typography } from "@mui/material";
import usePalette from "../../hooks/usePalette";

interface IXNGHyperlink {
  children: React.ReactNode;
  onClick: () => void;
}
function XNGHyperlink(props: IXNGHyperlink) {
  const palette = usePalette();

  return (
    <Typography
      variant="body1"
      sx={{
        width: "min-content",
        color: palette.primary[2],
        textDecoration: "underline",
        cursor: "pointer",
      }}
      onClick={() => props.onClick()}
      className="noselect"
    >
      {props.children}
    </Typography>
  );
}

export default XNGHyperlink;
