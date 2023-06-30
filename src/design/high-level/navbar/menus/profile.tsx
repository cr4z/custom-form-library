import { XNGICONS, XNGIconRenderer } from "../../../icons";
import VerticalTabs from "../../../low-level/tabs_vertical";
import { getSizing } from "../../../sizing";
import { Avatar, Typography } from "@mui/material";
import { IUnpostedSession } from "../types";
import { useEffect, useState } from "react";
import { XNGStandardTab } from "../../../types/xngStandardTab";
import { XNGSlideView } from "../../../components-dev/slide_view";
import { selectStateInUS } from "../../../../context/slices/stateInUsSlice";
import { selectClientID } from "../../../../context/slices/loggedInClientSlice";
import { selectLoggedInClientAssignment, selectUser, setUserResponse } from "../../../../context/slices/userProfileSlice";
import { useXNGDispatch, useXNGSelector } from "../../../../context/store";
import { PatchClientAssignmentRequest, PostAccessRequest, ServiceProviderCaseloadOption, ServiceProviderRef, UserRef } from "../../../../profile-sdk";
import { API_SERVICEPROVIDERS, API_USERS } from "../../../../api/api";
import { AddAnotherProvider } from "./my-profile/AddAnotherProvider";
import { DataEntryProviderControl } from "./my-profile/DataEntryProviderControl";
import { XNGUserCard_0 } from "./my-profile/UserCard";
import { AssistantProviderControl } from "./my-profile/AssistantProviderControl";
import { selectDataEntryProvider, setDataEntryProvider } from "../../../../context/slices/dataEntryProvider";
import { AddServiceProviderToCaseloadModal } from "../modals/AddServiceProviderToCaseloadModal";

enum SlideView {
  MyProfileView,
  UnpostedSessions,
  ContactUs,
  Help,
}

function ProfileMenu(props: { onCloseMenu: () => void; unpostedSessions: IUnpostedSession[] }) {
  // HOOKS
  const dispatch = useXNGDispatch();
  // STATES
  const [rightOpen, setRightOpen] = useState<boolean>(false);
  const [slideInView, setSlideInView] = useState<SlideView>(SlideView.MyProfileView);
  const [showAddToProxyCaseloadModal, setShowAddToProxyCaseloadModal] = useState<boolean>(false);
  const [showAddToApproverCaseloadModal, setShowAddToApproverCaseloadModal] = useState<boolean>(false);
  const [serviceProviderOptions, setServiceProviderOptions] = useState<ServiceProviderCaseloadOption[]>([]);

  // SELECTORS
  const state = useXNGSelector(selectStateInUS);
  const loggedInClientId = useXNGSelector(selectClientID);
  const user = useXNGSelector(selectUser);
  const userClientAssignment = useXNGSelector(selectLoggedInClientAssignment);
  const signedInDataEntryProvider = useXNGSelector(selectDataEntryProvider);

  // CONSTANTS
  const WIDTH = getSizing(45);
  const userInitials = `${user!.firstName?.charAt(0)}${user!.lastName?.charAt(0)}`;

  // USE EFFECTS
  useEffect(() => {
    fetchAndSetCaseloadServiceProviders();
  }, []);

  // FUNCTIONS
  function handleSlideView(v: SlideView) {
    setSlideInView(v);
    setRightOpen(true);
  }

  async function fetchAndSetCaseloadServiceProviders() {
    const response = await API_SERVICEPROVIDERS.v1ServiceProvidersGetAllServiceProvidersInCampusesGet(
      loggedInClientId!,
      state
    );
    const serviceProviders = response.serviceProviderCaseloadOptions;
    setServiceProviderOptions(serviceProviders ?? []);
  }
  async function setActiveProvider(serviceProviderId: string) {
    // TODO: This function should set the ActingServiceProvider redux variable to the
    const serviceProvider = await API_SERVICEPROVIDERS.v1ServiceProvidersIdGet(
      serviceProviderId,
      loggedInClientId!,
      state
    );
    // Redux variable for ActingServiceProvider should be set to serviceProvider.
    dispatch(setDataEntryProvider(serviceProvider));
  }

  async function removeProviderFromProxyCaseload(serviceProviderId: string) {
    const proxyCaseload = userClientAssignment.appointingServiceProviders;
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
    dispatch(setUserResponse(response));
  }

  async function removeProviderFromApproverCaseload(serviceProviderId: string) {
    const approverCaseload = userClientAssignment.supervisedServiceProviders;
    approverCaseload?.splice(
      approverCaseload.findIndex((sp) => sp.id === serviceProviderId),
      1
    );
    const request: PatchClientAssignmentRequest = {
      supervisedServiceProviders: approverCaseload,
    };
    const response = await API_USERS.v1UsersIdClientAssignmentsClientIdPatch(
      user!.id!,
      loggedInClientId!,
      state,
      request
    );
    dispatch(setUserResponse(response));
  }

  async function addProviderToProxyCaseload(serviceProvider: ServiceProviderRef | undefined) {
    if (!serviceProvider) return;
    //Patch users ClientAssignment to add ServiceProviderRef to user.AppointingServiceProviders
    const appointingServiceProviders = userClientAssignment.appointingServiceProviders ?? [];
    appointingServiceProviders.push(serviceProvider);
    const patchClientAssignmentRequest: PatchClientAssignmentRequest = {
      appointingServiceProviders: appointingServiceProviders,
    };
    const patchClientAssignmentResponse = await API_USERS.v1UsersIdClientAssignmentsClientIdPatch(
      user!.id!,
      loggedInClientId!,
      state,
      patchClientAssignmentRequest
    );

    const postAccessRequest: PostAccessRequest = {
      requestedServiceProvider: serviceProvider,
      requestingUser: {
        id: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.emailAddress,
      } as UserRef,
    };
    const postAccessResponse = await API_USERS.v1UsersRequestProxyAccessToPostPost(
      state,
      postAccessRequest
    );
  }

  async function addProviderToApproverCaseload(serviceProvider: ServiceProviderRef | undefined) {
    if (!serviceProvider) return;
    //Patch users ClientAssignment to add ServiceProviderRef to user.SupervisedServiceProviders
    const supervisedServiceProviders = userClientAssignment.supervisedServiceProviders ?? [];
    supervisedServiceProviders.push(serviceProvider);
    const patchClientAssignmentRequest: PatchClientAssignmentRequest = {
      appointingServiceProviders: supervisedServiceProviders,
    };
    const patchClientAssignmentResponse = await API_USERS.v1UsersIdClientAssignmentsClientIdPatch(
      user!.id!,
      loggedInClientId!,
      state,
      patchClientAssignmentRequest
    );
  }

  // TABS
  const tabs: XNGStandardTab[] = [
    {
      icon: <XNGIconRenderer size="md" i={<XNGICONS.Person />} />,
      label: "My Profile",
      onClick: () => handleSlideView(SlideView.MyProfileView),
    },
    {
      icon: <XNGIconRenderer size="md" i={<XNGICONS.AlarmClock />} />,
      label: (
        <Typography variant="body2">
          Un-Posted Sessions
          {props.unpostedSessions.length > 0 && (
            <Typography display="inline" variant="body2">
              {" (" + props.unpostedSessions.length + ")"}
            </Typography>
          )}
        </Typography>
      ),
      onClick: () => {},
    },
    {
      icon: <XNGIconRenderer size="md" i={<XNGICONS.Phone />} />,
      label: "Contact Us",
      onClick: () => {window.open("https://static.zdassets.com/web_widget/latest/liveChat.html?v=10#key=msbsconnect.zendesk.com", "_blank")},
    },
    {
      icon: <XNGIconRenderer size="md" i={<XNGICONS.Help />} />,
      label: "Help",
      onClick: () => {},
    },
  ];

  // DOM HIERARCHY
  return (
    <XNGSlideView
      slides={[
        {
          id: SlideView.MyProfileView,
          content: (
            <>
              <Typography sx={{ marginLeft: getSizing(2), marginY: getSizing(2) }} variant="h6">
                My Profile
              </Typography>
              <Typography sx={{ marginLeft: getSizing(2) }} variant="overline">
                ACCOUNT
              </Typography>
              <XNGUserCard_0
                user={{
                  email: user?.emailAddress!,
                  firstName: user?.firstName!,
                  lastName: user?.lastName!,
                }}
                useNavigationPath={{path:"/xlogs/my-profile"}}
              />
              {userClientAssignment.isProxyDataEntry ? (
                <>
                  <ProxyCaseloadManager
                    appointingServiceProviders={userClientAssignment?.appointingServiceProviders ?? []}
                    signedInServiceProvider={signedInDataEntryProvider ?? {}}
                    onRemove={(serviceProviderId) => removeProviderFromProxyCaseload(serviceProviderId)}
                    onSignIn={(serviceProviderId) => setActiveProvider(serviceProviderId)}
                    onSignOut={() => dispatch(setDataEntryProvider(null))}
                    showAddProxyCaseloadProviderModal={() => setShowAddToProxyCaseloadModal(true)}
                  />
                  <AddServiceProviderToCaseloadModal
                    addButtonText="Request Access"
                    handleAdd={(serviceProvider: ServiceProviderRef | undefined) =>
                      addProviderToProxyCaseload(serviceProvider)
                    }
                    setShowAddToCaseloadModal={(show: boolean) => setShowAddToProxyCaseloadModal(show)}
                    showAddToCaseloadModal={showAddToProxyCaseloadModal}
                    serviceProviderOptions={serviceProviderOptions}
                  />
                </>
              ) : (
                <></>
              )}
              {userClientAssignment.isApprover ? (
                <>
                  <ApproverCaseloadManager
                    supervisedServiceProviders={userClientAssignment?.supervisedServiceProviders ?? []}
                    onRemove={(serviceProviderId) => removeProviderFromApproverCaseload(serviceProviderId)}
                    showAddApproverCaseloadProviderModal={() => {
                      setShowAddToApproverCaseloadModal(true);
                    }}
                  />
                  <AddServiceProviderToCaseloadModal
                    addButtonText="Add Provider"
                    handleAdd={(serviceProvider: ServiceProviderRef | undefined) =>
                      addProviderToApproverCaseload(serviceProvider)
                    }
                    setShowAddToCaseloadModal={(show: boolean) => setShowAddToApproverCaseloadModal(show)}
                    showAddToCaseloadModal={showAddToApproverCaseloadModal}
                    serviceProviderOptions={serviceProviderOptions}
                  />
                </>
              ) : (
                <></>
              )}
            </>
          ),
        },
        {
          id: SlideView.UnpostedSessions,
          content: <></>,
        },
        {
          id: SlideView.ContactUs,
          content: <></>,
        },
        {
          id: SlideView.Help,
          content: <></>,
        },
      ]}
      rightOpen={rightOpen}
      left={<VerticalTabs displayCarets minWidth={WIDTH} tabs={tabs} />}
      value={slideInView}
      onClose={() => setRightOpen(false)}
      useDefaultBack
      width={WIDTH}
    />
  );
}
interface IProxyCaseloadManager {
  appointingServiceProviders: ServiceProviderRef[];
  signedInServiceProvider: ServiceProviderRef;
  onRemove: (serviceProviderId: string) => void;
  onSignIn: (serviceProviderId: string) => void;
  onSignOut: () => void;
  showAddProxyCaseloadProviderModal: () => void;
}
function ProxyCaseloadManager(props: IProxyCaseloadManager) {
  return (
    <>
      <Typography sx={{ marginLeft: getSizing(2) }} variant="overline">
        DATA ENTRY PROVIDERS
      </Typography>
      {props.appointingServiceProviders?.map((asp, i) => {
        return (
          <DataEntryProviderControl
            key={i}
            firstName={asp?.firstName ?? ""}
            lastName={asp?.lastName ?? ""}
            email={asp?.email ?? ""}
            onSignIn={() => props.onSignIn(asp.id!)}
            onSignOut={() => props.onSignOut()}
            signedIn={props.signedInServiceProvider.id === asp.id}
            onRemove={() => props.onRemove(asp.id!)}
          />
        );
      })}
      <AddAnotherProvider showModal={() => props.showAddProxyCaseloadProviderModal()} />
    </>
  );
}

export default ProfileMenu;

interface IApproverCaseloadManager {
  supervisedServiceProviders: ServiceProviderRef[];
  onRemove: (serviceProviderId: string) => void;
  showAddApproverCaseloadProviderModal: () => void;
}
function ApproverCaseloadManager(props: IApproverCaseloadManager) {
  return (
    <>
      <Typography sx={{ marginLeft: getSizing(2) }} variant="overline">
        ASSISTANTS
      </Typography>
      {props.supervisedServiceProviders?.map((asp) => {
        return (
          <AssistantProviderControl
            firstName={asp?.firstName ?? ""}
            lastName={asp?.lastName ?? ""}
            email={asp?.email ?? ""}
            onRemove={() => props.onRemove(asp.id!)}
          />
        );
      })}
      <AddAnotherProvider showModal={() => props.showAddApproverCaseloadProviderModal()} />
    </>
  );
}
