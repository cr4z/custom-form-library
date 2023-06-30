import { Dialog, SelectChangeEvent, Typography } from "@mui/material";
import Box from "../../../components-dev/BoxExtended";
import { getSizing } from "../../../sizing";
import XNGClose from "../../../low-level/button_close";
import { useState } from "react";
import {
  DistrictAccessRequest,
  ServiceProviderCaseloadOption,
  ServiceProviderRef,
} from "../../../../profile-sdk";
import { XLogsRole } from "../../../../context/types/xlogsrole";
import XNGButton from "../../../low-level/button";
import { XNGNonformSelect } from "../../../low-level/form_select";
import { XNGSearch } from "../../../low-level/input_search";

interface IAddServiceProviderToCaseloadModal {
  handleAdd: (serviceProvider: ServiceProviderRef | undefined) => void;
  setShowAddToCaseloadModal: (show: boolean) => void;
  showAddToCaseloadModal: boolean;
  addButtonText: string;
  serviceProviderOptions: ServiceProviderCaseloadOption[];
}
export function AddServiceProviderToCaseloadModal(props: IAddServiceProviderToCaseloadModal) {
  const [selectedServiceProvider, setSelectedServiceProvider] = useState<ServiceProviderRef>();

  return (
    <Dialog
      className="noselect"
      onClose={() => {
        props.setShowAddToCaseloadModal(false);
      }}
      open={props.showAddToCaseloadModal}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: getSizing(2),
          width: getSizing(55),
          overflow: "hidden"
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ marginTop: getSizing(1), paddingLeft: getSizing(1) }} variant="h6">
            Add Provider to Profile
          </Typography>
          <XNGClose onClick={() => props.setShowAddToCaseloadModal(false)} />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: getSizing(2),
            paddingTop: 0,
            gap: getSizing(2),
          }}
        >
          <Typography variant="body1">Type a provider's name to search: </Typography>
          <XNGSearch<ServiceProviderCaseloadOption>
            options={props.serviceProviderOptions}
            label=""
            onSelect={(serviceProvider: ServiceProviderCaseloadOption) =>
              setSelectedServiceProvider(serviceProvider)
            }
            getOptionLabel={(serviceProvider: ServiceProviderCaseloadOption) => {
              return `${serviceProvider.firstName} ${serviceProvider.lastName} - ${serviceProvider.campus}`;
            }}
            setValues={true}
          />
          <XNGButton
            onClick={() => {
              props.setShowAddToCaseloadModal(false);
              props.handleAdd(selectedServiceProvider);
            }}
          >
            {props.addButtonText}
          </XNGButton>
        </Box>
      </Box>
    </Dialog>
  );
}
