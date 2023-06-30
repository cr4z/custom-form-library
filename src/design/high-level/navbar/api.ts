import { IUnpostedSession, User } from "./types";

export const MyProfile_Actions = {
  removeDataEntryProviderFromProfile: (userID: string) => {},
  requestAccessDataEntryProvider: () => {},
};

export const MyProfile_Gets = {
  getAllDataEntryProviders: (): User[] => [],
};

// Unposted Sessions
export const UnpostedSessions_Gets = {
  getUnpostedSessions: async (): Promise<IUnpostedSession[]> => {
    return [];
  },
};
