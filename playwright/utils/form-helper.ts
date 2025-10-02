import {
  TEST_PATRON_INFO,
  TEST_HOME_ADDRESS,
  TEST_ALTERNATE_ADDRESS,
} from "../utils/constants";

export async function fillPersonalInfo(page) {
  await page.firstNameInput.fill(TEST_PATRON_INFO.firstName);
  await page.lastNameInput.fill(TEST_PATRON_INFO.lastName);
  await page.emailInput.fill(TEST_PATRON_INFO.email);
  await page.dateOfBirthInput.fill(TEST_PATRON_INFO.dateOfBirth);
  await page.checkBox.check();
}

// export async function fillHomeAddress(page, address) {
//   await page.fill('input[name="streetAddress"]', address.street);
//   await page.fill('input[name="apartmentSuite"]', address.apartmentSuite);
//   await page.fill('input[name="city"]', address.city);
//   await page.fill('input[name="state"]', address.state);
//   await page.fill('input[name="postalCode"]', address.postalCode);
// }

export async function fillAlternateAddress(page) {
  await page.streetAddressInput.fill(TEST_ALTERNATE_ADDRESS.street);
  await page.apartmentSuiteInput.fill(TEST_ALTERNATE_ADDRESS.apartmentSuite);
  await page.cityInput.fill(TEST_ALTERNATE_ADDRESS.city);
  await page.stateInput.fill(TEST_ALTERNATE_ADDRESS.state);
  await page.postalCodeInput.fill(TEST_ALTERNATE_ADDRESS.postalCode);
}
