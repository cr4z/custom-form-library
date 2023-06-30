import { Typography } from "@mui/material";
import { getSizing } from "../design/sizing";
import Box from "../design/components-dev/BoxExtended";
import { XNGFormInput } from "../design/components-form/textfield";
import { useXNGFormWithValidation } from "../design/hooks/useForm";
import { FormOneValues, stepOneFormValidation } from "./types";
import { XNGFormSelect } from "../design/components-form/select";
import { FloatingLayout, HEADER_SIZE, SUBHEADER_SIZE } from "../layouts/layout";
import { Logo } from "../design/low-level/logo";

export function FormExample() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useXNGFormWithValidation<FormOneValues>({ validationSchema: stepOneFormValidation });

  return (
    <FloatingLayout>
      <Logo />
      <br />
      <Typography variant="overline">Step 1 of 3</Typography>
      <Typography variant={HEADER_SIZE}>Fill out About You Information</Typography>
      <Typography sx={{ marginTop: getSizing(2), textAlign: "justify" }} variant="body1">
        Below is information that will inform your profile and permissions. Please ensure it is filled out
        and correct.
      </Typography>
      <Box sx={{ paddingTop: getSizing(3), paddingBottom: getSizing(2) }}>
        <Typography variant={SUBHEADER_SIZE}>About You</Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: getSizing(2) }}>
        <XNGFormInput
          name="firstName"
          label="First Name"
          control={control}
          register={register}
          useError={{ message: errors.firstName?.message }}
        />
        <XNGFormInput
          name="lastName"
          label="Last Name"
          control={control}
          register={register}
          useError={{ message: errors.lastName?.message }}
        />
        <XNGFormInput
          name="email"
          label="Email Address"
          control={control}
          register={register}
          useError={{ message: errors.email?.message }}
        />
        <XNGFormInput
          name="jobTitle"
          label="Job Title"
          control={control}
          register={register}
          useError={{ message: errors.jobTitle?.message }}
        />
        <XNGFormInput
          name="npi"
          label="NPI"
          placeholder="Optional..."
          control={control}
          register={register}
          useError={{ message: errors.npi?.message }}
        />
        <XNGFormInput
          name="stateMedicaidNumber"
          label="State Medicaid Number"
          placeholder="Optional..."
          control={control}
          register={register}
          useError={{ message: errors.stateMedicaidNumber?.message }}
        />
        {/* <XNGFormSelect<FormOneValues, SchoolCampusRef>
          getOptionLabel={(campus: SchoolCampusRef) => campus.name!}
          setValue={setValue}
          watch={watch}
          control={control}
          label="Primary Campus"
          name="primaryCampus"
          items={props.apiDependentValues.campusDropdownOptions}
          useError={{ message: errors.primaryCampus?.message }}
        /> */}
      </Box>
    </FloatingLayout>
  );
}
