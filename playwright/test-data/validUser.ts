export interface UserData {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  streetAddress: string;
  apartment: string;
  city: string;
  state: string;
  postalCode: string;
  alternateAddress: string;
  alternateApartment: string;
  alternateCity: string;
  alternateState: string;
  alternatePostalCode: string;
  username: string;
  password: string;
  homeLibrary: string;
}

export const validUser: UserData = {
  // step 1
  firstName: "Jane",
  lastName: "Doe",
  birthDate: "01/01/1990",
  email: "janedoe@example.com",
  // step 2
  streetAddress: "123 Main St",
  apartment: "Apt 4B",
  city: "New York",
  state: "NY",
  postalCode: "10001",
  // step 2.5
  alternateAddress: "456 Elm St",
  alternateApartment: "Apt 2A",
  alternateCity: "New York",
  alternateState: "NY",
  alternatePostalCode: "10001",
  // step 4
  username: "janedoe",
  password: "securepassword123",
  homeLibrary: "E-Branch", // reference in drop down locator
};
