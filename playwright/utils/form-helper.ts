import { TEST_PATRON_INFO } from "../utils/constants";

export async function fillPersonalInfo(page) {
  await page.firstNameInput.fill(TEST_PATRON_INFO.firstName);
  await page.lastNameInput.fill(TEST_PATRON_INFO.lastName);
  await page.emailInput.fill(TEST_PATRON_INFO.email);
  await page.dateOfBirthInput.fill(TEST_PATRON_INFO.dateOfBirth);
  await page.checkBox.check();
}

// export async function fillAddress(page, address) {
//   await page.fill('input[name="streetAddress"]', address.street);
//   await page.fill('input[name="apartmentSuite"]', address.apartmentSuite);
//   await page.fill('input[name="city"]', address.city);
//   await page.fill('input[name="state"]', address.state);
//   await page.fill('input[name="postalCode"]', address.postalCode);
// }

// export async function fillAlternateAddress(page, address) {
//   await page.fill('input[name="altStreetAddress"]', address.street);
//   await page.fill('input[name="altApartmentSuite"]', address.apartmentSuite);
//   await page.fill('input[name="altCity"]', address.city);
//   await page.fill('input[name="altState"]', address.state);
//   await page.fill('input[name="altPostalCode"]', address.postalCode);
// }
