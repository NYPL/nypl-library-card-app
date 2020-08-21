// The interface for the react-hook-form state data object.
export interface FormInputData {
  firstName: string;
  lastName: string;
  birthdate?: string;
  ageGate?: string;
  email: string;
  "home-line1": string;
  "home-line2": string;
  "home-city": string;
  "home-state": string;
  "home-zip": string;
  "home-hasBeenValidated": boolean;
  "home-isResidential": string;
  "work-line1": string;
  "work-line2": string;
  "work-city": string;
  "work-state": string;
  "work-zip": string;
  "work-hasBeenValidated": boolean;
  "work-isResidential": string;
  username: string;
  pin: string;
  ecommunicationsPref: boolean;
  location?: string;
  homeLibraryCode: string;
  acceptTerms: boolean;
  agencyType: string;
  policyType: string;
}
export interface ErrorParams {
  firstName?: string;
  lastName?: string;
  birthdate?: string;
  ageGate?: string;
  email?: string;
  "home-line1"?: string;
  "home-line2"?: string;
  "home-city"?: string;
  "home-state"?: string;
  "home-zip"?: string;
  "work-line1"?: string;
  "work-line2"?: string;
  "work-city"?: string;
  "work-state"?: string;
  "work-zip"?: string;
  username?: string;
  pin?: string;
  location?: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  isResidential?: boolean;
  hasBeenValidated?: boolean;
}

export interface Addresses {
  home: Address;
  work?: Address;
}

export interface AddressRequestData {
  address: Address;
  isWorkAddress: boolean;
}

export interface AddressAPIResponseData {
  status: string;
  success: boolean;
  isWorkAddress: boolean;
  cardType: null | string;
  address?: Address;
  originalAddress?: Address;
  addresses?: Address[];
  message?: string;
  reason?: string;
}

export interface AddressRenderType {
  address: Address | undefined;
  addresses: Address[] | undefined;
  message: string;
  reason: string;
  cardType?: null | string;
}

export interface AddressResponse {
  home: AddressRenderType;
  work: AddressRenderType;
}

export interface Params {
  errors?: ErrorParams;
  policyType?: string;
  parentsBarcode?: string;
  parentsUsername?: string;
  parentsEmail?: string;
  parentsAddress?: Partial<Address>;
}

export interface FormResults {
  status?: number;
  type?: string;
  link?: string;
  name?: string;
  barcode: string;
  username: string;
  pin: string;
  temporary: boolean;
  message: string;
  patronId: number;
}

export interface FormData {
  results: FormResults;
  errorObj: {};
  csrfToken: string;
  formValues: FormInputData;
  addressResponse: any;
}

export interface FormDataContextType {
  dispatch: ({ type: string, value: any }) => void;
  state: FormData;
}
