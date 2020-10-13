// The interface for the react-hook-form state data object.
export interface FormInputData {
  firstName: string;
  lastName: string;
  birthdate?: string;
  ageGate?: boolean;
  email: string;
  "home-line1": string;
  "home-line2": string;
  "home-city": string;
  "home-state": string;
  "home-zip": string;
  "home-hasBeenValidated"?: boolean;
  "home-isResidential"?: boolean;
  "home-county"?: string;
  "work-line1"?: string;
  "work-line2"?: string;
  "work-city"?: string;
  "work-state"?: string;
  "work-zip"?: string;
  "work-hasBeenValidated"?: boolean;
  "work-isResidential"?: boolean;
  "work-county"?: string;
  username: string;
  usernameHasBeenValidated?: boolean;
  pin: string;
  verifyPin: string;
  ecommunicationsPref: boolean;
  location?: string;
  homeLibraryCode: string;
  acceptTerms: boolean;
  agencyType?: string;
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

export enum AddressTypes {
  Home = "home",
  Work = "work",
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  county?: string;
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
  detail?: string;
  reason?: string;
}

export interface AddressRenderType {
  address: Address | undefined;
  addresses: Address[] | undefined;
  detail: string;
  reason?: string;
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
  results: FormResults | undefined;
  errorObj: ErrorResponse | undefined;
  csrfToken: string;
  formValues: FormInputData;
  addressResponse: any;
  query: any;
}

export interface FormDataContextType {
  dispatch: ({ type: string, value: any }) => void;
  state: FormData;
}

export interface LocationResponse {
  inUS: boolean;
  inNYState: boolean;
  inNYCity: boolean;
}

export interface LibraryListObject {
  value: string;
  label: string;
}

export interface ErrorResponse {
  status: number;
  type: string;
  title: string;
  detail?: string;
  message?: string;
  error?: {};
}

export interface FormAPISubmission {
  name?: string;
  firstName?: string;
  lastName?: string;
  username: string;
  usernameHasBeenValidated?: boolean;
  pin: string;
  address: Address;
  workAddress?: Address;
  email: string;
  ageGate?: boolean;
  birthdate?: string;
  ecommunicationsPref: boolean;
  policyType: string;
  agencyType?: string;
  homeLibraryCode: string;
  acceptTerms: boolean;
}
