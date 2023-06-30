import App from "../../App";
import { AccountInfo } from "@azure/msal-browser";
import { placeholderForFutureLogErrorText } from "../../temp/errorText";
import { useEffect, useState } from "react";
import Box from "../../design/components-dev/BoxExtended";
import { useXNGSelector } from "../../context/store";
import { selectAuthorizedDistricts, selectUser } from "../../context/slices/userProfileSlice";
import { API_USERS } from "../../api/api";
import IfElseBox from "../../design/components-dev/if_else_box";
import AccountRegistrationFlow from "./account_registration/account_registration";
import { UserResponse } from "../../profile-sdk";
import UserOnboarding from "./user_onboarding/user_onboarding";
import LoadingMessage from "../../design/high-level/loader_fullpage";
import { BLUE_BACKGROUND, FloatingLayout, HEADER_SIZE, NextButtonJustifiedRight } from "./layout";
import { getSizing } from "../../design/sizing";
import { Typography } from "@mui/material";
import { selectServiceProviderProfile } from "../../context/slices/loggedInClientSlice";

function OnboardingFlowHandler(props: { account: AccountInfo; onLogout: () => void }) {
  // REDUX SELECTORS
  const districts = useXNGSelector(selectAuthorizedDistricts);
  const user = useXNGSelector(selectUser);
  const serviceProviderProfile = useXNGSelector(selectServiceProviderProfile);

  // STATES
  const [requiresAccountRegistration, setUseAccountRegistrationFlow] = useState<boolean>(false);
  const [hasAuthorizedDistricts, setHasAuthorizedDistricts] = useState<boolean>(false);
  const [requiresOnboarding, setRequiresOnboarding] = useState<boolean>(false);
  const [conditionsInitialized, setConditionsInitialized] = useState<boolean>(false);

  // ---------------- FLOW CONDITION MANAGEMENT ----------------

  async function getRequiresAccountRegistrationAsync(): Promise<boolean> {
    if (!user) throw new Error(placeholderForFutureLogErrorText);

    const requiresAccountRegistration = user.clientAssignments === null;

    return requiresAccountRegistration;
  }

  async function getHasAuthorizedDistrictsAync(): Promise<boolean> {
    if (districts === undefined) return false;
    return districts.length > 0;
  }

  async function getRequiresOnboardingAsync(): Promise<boolean> {
    if (!user) throw new Error(placeholderForFutureLogErrorText);
    if (user.clientAssignments === undefined) throw new Error(placeholderForFutureLogErrorText);
    if (user.clientAssignments === null) {
      return true;
    }
    const requiresOnboarding = serviceProviderProfile?.id === undefined;
    return requiresOnboarding;
  }

  useEffect(() => {
    setConditionsAsync();
  }, []);
  async function setConditionsAsync() {
    const _shouldUseAccReg = await getRequiresAccountRegistrationAsync();
    const _hasAuthorizedDistricts = await getHasAuthorizedDistrictsAync();
    const _requiresOnboarding = await getRequiresOnboardingAsync();

    setUseAccountRegistrationFlow(_shouldUseAccReg);
    setHasAuthorizedDistricts(_hasAuthorizedDistricts);
    setRequiresOnboarding(_requiresOnboarding);
    setConditionsInitialized(true);
  }

  return (
    <IfElseBox
      if={!conditionsInitialized}
      then={<LoadingMessage message="Assessing info..." />}
      else={
        <IfElseBox
          if={requiresAccountRegistration}
          then={<AccountRegistrationFlow account={props.account} />}
          else={
            <IfElseBox
              if={hasAuthorizedDistricts}
              then={
                <IfElseBox
                  if={requiresOnboarding}
                  then={<UserOnboarding account={props.account} />}
                  else={<App />}
                />
              }
              // Otherwise, they are waiting for their district admin to approve
              else={
                <Box sx={BLUE_BACKGROUND}>
                  <FloatingLayout>
                    <Typography variant={HEADER_SIZE}>Request District Access</Typography>
                    <Typography sx={{ marginTop: getSizing(2), textAlign: "justify" }} variant="body1">
                      {MESSAGE}
                    </Typography>
                    <NextButtonJustifiedRight overrideText="Logout" onNext={() => props.onLogout()} />
                  </FloatingLayout>
                </Box>
              }
            />
          }
        />
      }
    />
  );
}

const MESSAGE =
  "Your request has been sent to the district administrator on the account. Please wait for your district admin to view and confirm your request.";

export default OnboardingFlowHandler;
