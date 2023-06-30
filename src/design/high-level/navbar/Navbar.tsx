import { useState, useEffect } from "react";
import usePalette from "../../../hooks/usePalette";
import Box from "../../components-dev/BoxExtended";
import { XNGStandardTab } from "../../types/xngStandardTab";
import { ReactComponent as XLogsLogoSvg } from "../../svgs/logo.svg";
import TransparentTabs from "../../low-level/tabs_transparent";
import { IconButton, Typography, useTheme } from "@mui/material";
import XNGBadge from "../../low-level/badge";
import DropdownIndicator from "../../low-level/dropdown_indicator";
import { XNGMenu, XNGMenuAnchorBox } from "../../components-dev/xng_menu";
import { XNGICONS, XNGIconRenderer } from "../../icons";
import MediaQueryBox from "../../components-dev/MediaQueryBox";
import {
  ROOTNAME_COMMANDER,
  ROOTNAME_XLOGS,
  ROUTES_COMMANDER as ROUTES_COMMANDER,
  ROUTES_XLOGS,
} from "../../../constants/URLs";
import { useLocation, useNavigate } from "react-router";
import { getSizing } from "../../sizing";
import { BOX_SHADOWS } from "../../styles/boxShadow";
import NotificationsMenu from "./menus/notifications";
import ProfileMenu from "./menus/profile";
import ProductSuiteMenu from "./menus/product_suite";
import { INotification, IUnpostedSession } from "./types";
import { UnpostedSessions_Gets } from "./api";
import { selectClientID } from "../../../context/slices/loggedInClientSlice";
import {
  selectLoggedInClientAssignment,
  selectUser,
  setUserResponse,
} from "../../../context/slices/userProfileSlice";
import { placeholderForFutureLogErrorText } from "../../../temp/errorText";
import { selectStateInUS } from "../../../context/slices/stateInUsSlice";
import { XNGNonformSelect } from "../../low-level/form_select";
import { breakpointUtils } from "../../../utils/breakpointUtils";
import XNGAvatar from "../../low-level/avatar";
import { useXNGDispatch, useXNGSelector } from "../../../context/store";
import {
  AppointingServiceProviderRef,
  ClientRef,
  PatchClientAssignmentRequest,
  PatchUserRequest,
  UserResponse,
} from "../../../profile-sdk";
import { API_USERS } from "../../../api/api";
import { selectDataEntryProvider, setDataEntryProvider } from "../../../context/slices/dataEntryProvider";

import { CurrentDataEntryProviderMenu } from "./menus/currentDataEntryProviderMenu";

enum MSBProduct {
  XLogs,
  Commander,
}

export const NAVBAR_HEIGHT = getSizing(8);

function Navbar() {
  // REDUX SELECTORS
  const user = useXNGSelector(selectUser);
  const dataEntryProvider = useXNGSelector(selectDataEntryProvider);
  // HOOKS
  const location = useLocation();
  const palette = usePalette();
  const dispatch = useXNGDispatch();

  // TABS
  const TABS_XLOGS: XNGStandardTab[] = [
    {
      id: 0,
      label: "calendar",
      onClick: () => setSelectedTabIndex(0),
      navTo: ROUTES_XLOGS.calendar,
    },
    {
      id: 1,
      label: "students",
      onClick: () => setSelectedTabIndex(1),
      navTo: ROUTES_XLOGS._students.manager,
    },
  ];
  const TABS_COMMANDER: XNGStandardTab[] = [
    {
      id: 0,
      label: "profile management",
      onClick: () => setSelectedTabIndex(0),
      navTo: ROUTES_COMMANDER.profileManagement,
    },
    {
      id: 1,
      label: "Billing/Invoicing",
      onClick: () => setSelectedTabIndex(1),
      navTo: ROUTES_COMMANDER.billingInvoicing,
    },
    {
      id: 2,
      label: "MSB Tools",
      onClick: () => setSelectedTabIndex(2),
      navTo: ROUTES_COMMANDER.msbTools,
    },
    {
      id: 3,
      label: "Reports",
      onClick: () => setSelectedTabIndex(3),
      navTo: ROUTES_COMMANDER.reports,
    },
    {
      id: 4,
      label: "Analytics",
      onClick: () => setSelectedTabIndex(4),
      navTo: ROUTES_COMMANDER.analytics,
    },
  ];

  // SELECTORS
  const loggedInClientId = useXNGSelector(selectClientID);
  const userProfile = useXNGSelector(selectUser);
  const loggedInClientAssignment = useXNGSelector(selectLoggedInClientAssignment);
  const state = useXNGSelector(selectStateInUS);

  // STATES
  const [selectedTab, setSelectedTabIndex] = useState<number>(0);
  const [tabs, setTabs] = useState<XNGStandardTab[]>(TABS_XLOGS);
  const [product, setProduct] = useState<MSBProduct>(MSBProduct.XLogs);

  // MENUS STATES
  const [myProfileOpen, setMyProfileOpen] = useState<boolean>(false);
  const [myProfileAnchorEl, setMyProfileAnchorEl] = useState<HTMLElement | null>(null);
  const [suiteAnchorEl, setSuiteAnchorEl] = useState<HTMLElement | null>(null);
  const [suiteOpen, setSuiteOpen] = useState<boolean>(false);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<HTMLElement | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [dataEntryProviderOpen, setDataEntryProviderOpen] = useState<boolean>(false);
  const [dataEntryProviderAnchorEl, setActingServiceProviderAnchorEl] = useState<HTMLElement | null>(null);

  //
  const firstNameInitial = dataEntryProvider?.firstName?.charAt(0) ?? "";
  const lastNameInitial = dataEntryProvider?.lastName?.charAt(0) ?? "";
  const actingServiceProviderInitials = firstNameInitial + lastNameInitial;
  // USEEFFECTS
  useEffect(() => {
    const path = location.pathname.split("/")[1];
    switch (path) {
      case ROOTNAME_XLOGS:
        setProduct(MSBProduct.XLogs);
        setTabs(TABS_XLOGS);
        break;
      case ROOTNAME_COMMANDER:
        setProduct(MSBProduct.Commander);
        setTabs(TABS_COMMANDER);
        break;
    }
  }, [location]);

  // API - NOTIFICATIONS //
  // -- State
  const [notifications, setNotifications] = useState<INotification[]>([]);
  // -- API Request
  async function fetchAndSetNotifications() {
    console.log("BEGINNING FETCH NOTIFICATIONS")
    const userServiceProviderId = loggedInClientAssignment?.serviceProviderProfile?.id;
    console.log("userServiceProviderId: ", userServiceProviderId);
    const userId = userProfile?.id;
    console.log("userId: ", userId);
    var districtIds;
    if (loggedInClientAssignment.isExecutiveAdmin || loggedInClientAssignment.isDelegatedAdmin) {
      // TODO: We'll need to update this to send all districtIds that the user is authorized in for this client.
      districtIds = loggedInClientAssignment?.authorizedDistricts?.map((ad) => ad.id).join(",");
    }
    console.log("districtIds: ", districtIds);
    if (userServiceProviderId === undefined) throw Error(placeholderForFutureLogErrorText);
    if (userId === undefined) throw Error(placeholderForFutureLogErrorText);
    if (loggedInClientId === undefined) throw Error(placeholderForFutureLogErrorText);

    const response = await API_USERS.v1UsersNotificationsGet(
      userId,
      userServiceProviderId,
      state,
      districtIds
    );
    const notifications: INotification[] = [];
    response.districtAccessRequestNotifications?.forEach((dar) => notifications.push(dar as INotification));
    response.serviceProviderNotifications?.forEach((spn) => notifications.push(spn as INotification));
    response.userNotifications?.forEach((un) => notifications.push(un as INotification));
    console.log(notifications);
    setNotifications(notifications);
  }
  // -- Polling System
  useEffect(() => {
    fetchAndSetNotifications();
    const interval = setInterval(() => {
      fetchAndSetNotifications();
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  // -- Helpers
  function getUnreadNotificationsCount(): number {
    return notifications.filter((n: INotification) => n.read === undefined).length;
  }

  // API - UN-POSTED SESSIONS //
  // -- State
  const [unpostedSessions, setUnpostedSessions] = useState<IUnpostedSession[]>([]);
  // -- API Request
  async function fetchAndSetUnpostedSessions() {
    const dbsessions = await UnpostedSessions_Gets.getUnpostedSessions();
    setUnpostedSessions(dbsessions);
  }

  async function removeProviderFromProxyCaseload(serviceProviderId: string) {
    const proxyCaseload = loggedInClientAssignment.appointingServiceProviders;
    proxyCaseload?.splice(
      proxyCaseload.findIndex((sp) => sp.id === serviceProviderId),
      1
    );
    const request: PatchClientAssignmentRequest = {
      appointingServiceProviders: proxyCaseload,
    };
    const response = await API_USERS.v1UsersIdClientAssignmentsClientIdPatch(
      user!.id!,
      loggedInClientId!,
      state,
      request
    );
    setUserResponse(response);
  }

  // -- Initial Request
  useEffect(() => {
    fetchAndSetUnpostedSessions();
  }, []);

  // REORGANIZE LATER
  const stateInUs = useXNGSelector(selectStateInUS);
  const navigate = useNavigate();
  const [clientReferences, setClientReferences] = useState<ClientRef[]>([]);
  useEffect(() => {
    fetchAndSetClientReferences();

    async function fetchAndSetClientReferences() {
      try {
        const res: ClientRef[] = [];
        user!.clientAssignments!.forEach((ca) => {
          if (ca!.authorizedDistricts!.length > 0) {
            res.push(ca.client as ClientRef);
          }
        });

        setClientReferences(res);
      } catch (e) {
        throw new Error(placeholderForFutureLogErrorText);
      }
    }
  }, []);

  // DOM HIERARCHY
  return (
    <>
      {/* MENUS */}
      <XNGMenu
        anchorEl={suiteAnchorEl}
        open={suiteOpen}
        onClose={() => setSuiteOpen(false)}
        content={<ProductSuiteMenu onCloseMenu={() => setSuiteOpen(false)} />}
      />
      <XNGMenu
        anchorEl={notificationsAnchorEl}
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        content={
          <NotificationsMenu notifications={notifications} onClose={() => setNotificationsOpen(false)} />
        }
      />
      <XNGMenu
        anchorEl={myProfileAnchorEl}
        open={myProfileOpen}
        onClose={() => setMyProfileOpen(false)}
        content={
          <ProfileMenu onCloseMenu={() => setMyProfileOpen(false)} unpostedSessions={unpostedSessions} />
        }
      />
      <XNGMenu
        anchorEl={dataEntryProviderAnchorEl}
        open={dataEntryProviderOpen}
        onClose={() => setDataEntryProviderOpen(false)}
        content={
          <CurrentDataEntryProviderMenu
            setShowMenu={(show) => setDataEntryProviderOpen(show)}
            currentDataEntryProvider={dataEntryProvider ?? {}}
            user={user!}
            onSignOut={() => {
              dispatch(setDataEntryProvider(null));
              setDataEntryProviderOpen(false);
            }}
            onRemove={() => removeProviderFromProxyCaseload(dataEntryProvider!.id!)}
            onBackToProfile={() => {
              dispatch(setDataEntryProvider(null));
              setDataEntryProviderOpen(false);
            }}
          />
        }
      />

      {/* DOM */}
      <Box sx={{ display: "flex", width: "100%", minHeight: NAVBAR_HEIGHT, ...BOX_SHADOWS[0] }}>
        <XNGMenuAnchorBox
          sx={{
            display: "flex",
            alignItems: "center",
            gap: getSizing(1),
            cursor: "pointer",
            padding: getSizing(1),
          }}
          onClickSetAnchorEl={(e) => setSuiteAnchorEl(e)}
          onClickSetOpen={() => setSuiteOpen(true)}
        >
          <IconButton>
            <XNGIconRenderer i={<XNGICONS.Grid4X4 />} color={palette.contrasts[1]} size="lg" />
          </IconButton>
        </XNGMenuAnchorBox>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: getSizing(1),
            minWidth: breakpointUtils.greaterThan("sm") ? getSizing(40) : getSizing(10),
          }}
        >
          <XLogsLogo product={product} />
          <Box sx={{ display: "flex", flexDirection: "column", paddingTop: getSizing(0.5) }}>
            {clientReferences[0] !== undefined && (
              <XNGNonformSelect<ClientRef>
                items={clientReferences}
                label=""
                onSelect={(clientRef: ClientRef) => {
                  changeLoggedInClientIDAndRefresh();

                  async function changeLoggedInClientIDAndRefresh() {
                    if (!user) throw new Error(placeholderForFutureLogErrorText);
                    if (!user.id) throw new Error(placeholderForFutureLogErrorText);

                    const patchUserRequest: PatchUserRequest = { loggedInClientId: clientRef.id };
                    await API_USERS.v1UsersIdPatch(user.id, stateInUs, patchUserRequest);
                    navigate(0);
                  }
                }}
                getOptionLabel={(i) => i.name}
                defaultValue={clientReferences.find(c => c.id === user?.loggedInClientId) ?? clientReferences[0]}
                variant="minimal"
              />
            )}
          </Box>
        </Box>
        <VerticalDivider />
        <TransparentTabs
          useDropdownBreakpoint={{ breakpoint: 1200, selectedValue: tabs[selectedTab]?.id! }}
          value={selectedTab}
          tabs={tabs}
        />

        <Box
          sx={{
            marginLeft: "auto",
            display: "flex",
            height: "100%",
            alignItems: "center",
            paddingRight: getSizing(1),
            gap: getSizing(1),
          }}
        >
          <XNGMenuAnchorBox
            onClickSetAnchorEl={(el) => setNotificationsAnchorEl(el)}
            onClickSetOpen={() => setNotificationsOpen(true)}
            sx={{ display: "block" }}
          >
            <IconButton>
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  display: "flex",
                  width: getSizing(1.6),
                  height: getSizing(1.6),
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 999,
                  bgcolor: palette.danger[2],
                  color: palette.contrasts[5],
                }}
              >
                <Typography variant="subtitle1">{getUnreadNotificationsCount()}</Typography>
              </Box>

              <XNGIconRenderer i={<XNGICONS.Bell />} color={palette.contrasts[1]} size="md" />
            </IconButton>
          </XNGMenuAnchorBox>

          {dataEntryProvider && (
            <XNGMenuAnchorBox
              onClickSetAnchorEl={(el) => setActingServiceProviderAnchorEl(el)}
              onClickSetOpen={() => setDataEntryProviderOpen(true)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: getSizing(1),
                cursor: "pointer",
                padding: getSizing(1),
              }}
            >
              <XNGAvatar useCheckDecoration text={actingServiceProviderInitials} />
              <DropdownIndicator open={dataEntryProviderOpen} />
            </XNGMenuAnchorBox>
          )}
          <XNGMenuAnchorBox
            onClickSetAnchorEl={(el) => setMyProfileAnchorEl(el)}
            onClickSetOpen={() => setMyProfileOpen(true)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: getSizing(1),
              cursor: "pointer",
              padding: getSizing(1),
            }}
          >
            <XNGAvatar variant="outline" text={user!.firstName![0]! + user!.lastName![0]!} />
            <DropdownIndicator open={myProfileOpen} />
          </XNGMenuAnchorBox>
        </Box>
      </Box>
    </>
  );
}

function VerticalDivider() {
  const palette = usePalette();

  return (
    <Box
      sx={{
        height: "100%",
        alignItems: "center",
        display: "flex",
        marginX: getSizing(3),
      }}
    >
      <Box sx={{ width: "1px", height: "50%", bgcolor: palette.contrasts[3] }} />
    </Box>
  );
}

function XLogsLogo(props: { product: MSBProduct }) {
  const theme = useTheme();
  const palette = usePalette();

  return (
    <>
      <MediaQueryBox sx={{ display: "flex", alignItems: "center" }} showIf={theme.breakpoints.down("md")}>
        {props.product === MSBProduct.XLogs ? (
          <XNGICONS.XLogs_X />
        ) : (
          <XNGIconRenderer i={<XNGICONS.Commander />} color={palette.contrasts[1]} size="lg" />
        )}
      </MediaQueryBox>
      <MediaQueryBox
        sx={{
          minWidth: "140px",
          maxWidth: "280px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        showIf={theme.breakpoints.up("md")}
      >
        {props.product === MSBProduct.XLogs ? (
          <XLogsLogoSvg />
        ) : (
          <>
            <XNGIconRenderer i={<XNGICONS.Commander />} color={palette.contrasts[1]} size="lg" />

            <Typography
              className="noselect"
              variant="h5"
              sx={{ marginLeft: getSizing(1) }}
              color={palette.contrasts[1]}
            >
              Commander
            </Typography>
          </>
        )}
      </MediaQueryBox>
    </>
  );
}

export default Navbar;
