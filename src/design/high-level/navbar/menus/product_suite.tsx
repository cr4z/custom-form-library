import { ROUTES_COMMANDER, ROUTES_XLOGS } from "../../../../constants/URLs";
import usePalette from "../../../../hooks/usePalette";
import { XNGICONS, XNGIconRenderer } from "../../../icons";
import VerticalTabs from "../../../low-level/tabs_vertical";

function ProductSuiteMenu(props: { onCloseMenu: () => void }) {
  const palette = usePalette();

  return (
    <VerticalTabs
      onClick={() => props.onCloseMenu()}
      tabs={[
        {
          icon: <XNGIconRenderer i={<XNGICONS.XLogs_X />} color={palette.contrasts[1]} size="lg" />,
          label: "X Logs",
          navTo: ROUTES_XLOGS.calendar,
        },
        {
          icon: <XNGIconRenderer i={<XNGICONS.Commander />} color={palette.contrasts[1]} size="lg" />,
          label: "Commander",
          navTo: ROUTES_COMMANDER.profileManagement,
        },
      ]}
    />
  );
}

export default ProductSuiteMenu;
