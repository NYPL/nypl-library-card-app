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
  "work-line1": string;
  "work-line2": string;
  "work-city": string;
  "work-state": string;
  "work-zip": string;
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
