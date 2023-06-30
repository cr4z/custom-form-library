import { FormControl, Select, Typography } from "@mui/material";
import Box from "../../../components-dev/BoxExtended";
import { getSizing } from "../../../sizing";
import XNGToggle from "../../../low-level/button_toggle";
import XNGClose from "../../../low-level/button_close";
// import { DistrictAccessRequest } from "./notification_types";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { useState } from "react";
import { INotification } from "../types";
import {
  DistrictAccessRequest,
  NotificationResponseType,
  NotificationType,
  RespondToRequestForAccessToPost,
  RespondToRequestForDistrictAccessRequest,
  RoleAssignments,
  UserRef,
} from "../../../../profile-sdk";
import { API_USERS } from "../../../../api/api";
import { useXNGSelector } from "../../../../context/store";
import { selectClientID } from "../../../../context/slices/loggedInClientSlice";
import { selectStateInUS } from "../../../../context/slices/stateInUsSlice";
import { selectLoggedInClientAssignment, selectUser } from "../../../../context/slices/userProfileSlice";
import { XLogsRole } from "../../../../context/types/xlogsrole";
import XNGSelect from "../../../low-level/dropdown";
import { NotificationItem } from "./notifications/NotificationItem";
import { ApproveDistrictAccessModal } from "./notifications/ApproveDistrictAccessModal";
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(relativeTime);

interface INotificationsMenu {
  notifications: INotification[];
  onClose: () => void;
}

function NotificationsMenu(props: INotificationsMenu) {
  const [showOnlyUnread, setShowOnlyUnread] = useState<boolean>(false);

  return (
    <Box sx={{ width: getSizing(50) }}>
      <Header
        showOnlyUnread={showOnlyUnread}
        onToggleShowOnlyUnread={() => setShowOnlyUnread(!showOnlyUnread)}
        onClose={() => props.onClose()}
      />
      <Content showOnlyUnread={showOnlyUnread} notifications={props.notifications} />
    </Box>
  );
}

interface IHeader {
  onToggleShowOnlyUnread: () => void;
  showOnlyUnread: boolean;
  onClose: () => void;
}
function Header(props: IHeader) {
  return (
    <Box
      name="Header"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        paddingLeft: getSizing(2),
        paddingRight: getSizing(1),
      }}
    >
      <Box name="Header | LEFT" sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h6" className="noselect">
          Notifications
        </Typography>
      </Box>
      <Box name="Header | RIGHT" sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body2" className="noselect">
          Show Only Unread
        </Typography>
        <XNGToggle value={props.showOnlyUnread} onToggle={() => props.onToggleShowOnlyUnread()} />
        <XNGClose onClick={() => props.onClose()} size="modal" />
      </Box>
    </Box>
  );
}

function Content(props: { notifications: INotification[]; showOnlyUnread: boolean }) {
  // SELECTORS
  const loggedInClientId = useXNGSelector(selectClientID);
  const state = useXNGSelector(selectStateInUS);
  const loggedInClientAssignment = useXNGSelector(selectLoggedInClientAssignment);
  const serviceProviderOfUser = loggedInClientAssignment.serviceProviderProfile;
  const userProfile = useXNGSelector(selectUser);

  // STATE
  const [showApproveDistrictAccessModal, setShowApproveDistrictAccessModal] = useState<boolean>(false);
  const [selectedDistrictAccessRequest, setSelectedDistrictAccessRequest] =
    useState<DistrictAccessRequest>();

  async function responseYesToProxyAccessRequest(notificationId: string) {
    const request: RespondToRequestForAccessToPost = {
      notificationId: notificationId,
      message: `${serviceProviderOfUser?.firstName} ${serviceProviderOfUser?.lastName} has allowed access to post in their account.`,
      responseType: NotificationResponseType.NUMBER_0,
      //HACK: The sdk needs to be updated to take in the requestedServiceProviderId, and RespondingServiceProvider, but for now the
      // requestingUserId, and the RespondingUser fields of the request are used as if they're the service provider, so we'll incorrectly
      // fill the user fields with the user's serviceProvider info.
      requestedUserId: serviceProviderOfUser?.id,
      respondingUser: serviceProviderOfUser,
    };
    await API_USERS.v1UsersRequestProxyAccessToPostRespondPost(loggedInClientId!, state, request);
  }

  async function responseNoToProxyAccessRequest(notificationId: string) {
    const request: RespondToRequestForAccessToPost = {
      notificationId: notificationId,
      message: `${serviceProviderOfUser?.firstName} ${serviceProviderOfUser?.lastName} has denied your access to post in thier account.
      You may attempt to request access again at any time.`,
      responseType: NotificationResponseType.NUMBER_1,
      //HACK: The sdk needs to be updated to take in the requestedServiceProviderId, and RespondingServiceProvider, but for now the
      // requestingUserId, and the RespondingUser fields of the request are used as if they're the service provider, so we'll incorrectly
      // fill the user fields with the user's serviceProvider info.
      requestedUserId: serviceProviderOfUser?.id,
      respondingUser: serviceProviderOfUser,
    };
    await API_USERS.v1UsersRequestProxyAccessToPostRespondPost(loggedInClientId!, state, request);
  }

  function onYesClickOfDistrictAccessRequest(notification: DistrictAccessRequest) {
    console.log("Yes clicked!");
    setSelectedDistrictAccessRequest(notification);
    setShowApproveDistrictAccessModal(true);
  }

  async function respondYesToDistrictAccessRequest(notification: DistrictAccessRequest, role: XLogsRole) {
    console.log("YES");
    const district = notification.requestedDistrictAssignment?.district;
    const request: RespondToRequestForDistrictAccessRequest = {
      districtId: district?.id,
      message: `You have been granted access to ${district?.name}.`,
      notificationId: notification.id!,
      respondingUser: {
        email: userProfile?.emailAddress,
        firstName: userProfile?.firstName,
        lastName: userProfile?.lastName,
        id: userProfile?.id,
      } as UserRef,
      responseType: NotificationResponseType.NUMBER_0,
      roleAssignments: ConstructRoleAssignmentsFromXLogsRole(role),
    };
    await API_USERS.v1UsersRequestAccessToDistrictRespondPost(state, request);
  }

  async function respondNoToDistrictAccessRequest(notification: DistrictAccessRequest) {
    console.log("NO");
    const district = notification.requestedDistrictAssignment?.district;
    const request: RespondToRequestForDistrictAccessRequest = {
      districtId: district?.id,
      message: `You have been denied access to ${district?.name}.`,
      notificationId: notification.id!,
      respondingUser: userProfile as UserRef,
      responseType: NotificationResponseType.NUMBER_1,
    };
    await API_USERS.v1UsersRequestAccessToDistrictRespondPost(state, request);
  }

  async function markNotificationAsRead(notificationId: string, partionKey: string) {
    //Use the SDK here.
  }

  function ConstructRoleAssignmentsFromXLogsRole(role: XLogsRole): RoleAssignments {
    switch (role) {
      case "Service Provider - Autonomous":
        return {
          isAutonomous: true,
        };
      case "Service Provider - Assistant":
        return {
          isAutonomous: false,
        };
      case "Approver":
        return {
          isApprover: true,
          isAutonomous: true,
        };
      case "Proxy Data Entry":
        return {
          isProxyDataEntry: true,
          isAutonomous: true,
        };
      case "Delegated Admin":
        return {
          isDelegatedAdmin: true,
          isAutonomous: true,
          isProxyDataEntry: true,
          isApprover: true,
        };
      case "Executive Admin":
        return {
          isExecutiveAdmin: true,
          isAutonomous: true,
          isProxyDataEntry: true,
          isApprover: true,
        };
    }
  }
  // RENDERER SWITCH CASE
  function renderNotificationItem(n: INotification, i: number): JSX.Element {
    console.log("Rendering Notification: ", n);
    switch (n.type) {
      case NotificationType.NUMBER_0: // Proxy Access to Post Request
        return (
          <NotificationItem
            key={i}
            text={n.message ?? ""}
            date={dayjs(n.created)}
            unread={(n.read === undefined || n.read === null)}
            onYes={() => responseYesToProxyAccessRequest(n.id!)}
            onNo={() => responseNoToProxyAccessRequest(n.id!)}
            onRead={() => {markNotificationAsRead(n.id, n.partitionKey)}}
          />
        );
      case NotificationType.NUMBER_2: // District Access Request
        return (
          <NotificationItem
            key={i}
            text={n.message ?? ""}
            date={dayjs(n.created)}
            unread={(n.read === undefined || n.read === null)}
            onYes={() => onYesClickOfDistrictAccessRequest(n)}
            onNo={() => respondNoToDistrictAccessRequest(n)}
            onRead={() => {markNotificationAsRead(n.id, n.partitionKey)}}
          />
        );
      case NotificationType.NUMBER_3 || NotificationType.NUMBER_4 || NotificationType.NUMBER_5:
        return (
          <NotificationItem
            key={i}
            text={n.message ?? ""}
            date={dayjs(n.created)}
            unread={(n.read === undefined || n.read === null)}
            onRead={() => {markNotificationAsRead(n.id, n.partitionKey)}}
          />
        );
      default:
        return (
          <NotificationItem
            key={i}
            text={n.message ?? ""}
            date={dayjs(n.created)}
            unread={(n.read === undefined || n.read === null)}
            onRead={() => {markNotificationAsRead(n.id, n.partitionKey)}}
          />
        );
    }
  }

  // NOTIFICATION ARRAYS (Today, Yesterday, Older)
  const TWO_DAYS_AGO = dayjs().subtract(2, "days");
  
  const todayNotifications = props.notifications
    .filter(
      (n: INotification) =>
        dayjs(n.created).isToday() && (props.showOnlyUnread ? (n.read === undefined || n.read === null) : true)
    )
    .reverse();
  console.log("Today's Notifications: ", todayNotifications);
  
  const yesterdayNotifications = props.notifications
    .filter(
      (n: INotification) =>
        dayjs(n.created).isYesterday() && (props.showOnlyUnread ? (n.read === undefined || n.read === null) : true)
    )
    .reverse();
  console.log("Yesterday's Notifications: ", yesterdayNotifications);

  const olderNotifications = props.notifications
    .filter(
      (n: INotification) =>
        dayjs(n.created).isBefore(TWO_DAYS_AGO) && (props.showOnlyUnread ? (n.read === undefined || n.read === null) : true)
    )
    .reverse();
  console.log("Older Notifications: ", olderNotifications);
  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", paddingBottom: getSizing(2) }}>
        <Typography
          display={todayNotifications.length > 0 ? "inline-block" : "none"}
          sx={{ marginTop: getSizing(1), marginLeft: getSizing(2) }}
          variant="overline"
          className="noselect"
        >
          TODAY
        </Typography>
        {todayNotifications.map((n: INotification, i) => renderNotificationItem(n, i))}
        <Typography
          display={yesterdayNotifications.length > 0 ? "inline-block" : "none"}
          sx={{ marginTop: getSizing(1), marginLeft: getSizing(2) }}
          variant="overline"
          className="noselect"
        >
          YESTERDAY
        </Typography>
        {yesterdayNotifications.map((n: INotification, i) => renderNotificationItem(n, i))}
        <Typography
          display={olderNotifications.length > 0 ? "inline-block" : "none"}
          sx={{ marginTop: getSizing(1), marginLeft: getSizing(2) }}
          variant="overline"
          className="noselect"
        >
          OLDER
        </Typography>
        {olderNotifications.map((n: INotification, i) => renderNotificationItem(n, i))}
      </Box>
      <ApproveDistrictAccessModal
        handleDone={(role: XLogsRole) =>
          respondYesToDistrictAccessRequest(selectedDistrictAccessRequest!, role)
        }
        districtAccessRequest={selectedDistrictAccessRequest}
        setShowApproveDistrictAccessModal={(show: boolean) => setShowApproveDistrictAccessModal(show)}
        showApproveDistrictAccessModal={showApproveDistrictAccessModal}
      />
    </>
  );
}

export default NotificationsMenu;
