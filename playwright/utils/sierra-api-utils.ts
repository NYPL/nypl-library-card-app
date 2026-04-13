import { expect } from "@playwright/test";
import { PatronData, AddressData } from "./types";
import { createFuzzyMatcher, formatSierraDate } from "./formatter";

const sierraApiBaseUrl = process.env.SIERRA_API_BASE_URL_QA;
const basicAuth = process.env.SIERRA_BASIC_AUTH_BASE64;

export interface SierraPatron {
  id: number;
  names: string[];
  birthDate?: string;
  addresses?: {
    lines: string[];
    type: string;
  }[];
  emails?: string[];
  patronType: number;
  patronCodes: {
    pcode1: string;
  };
}

export async function getAuthToken(): Promise<string> {
  const response = await fetch(`${sierraApiBaseUrl}/iii/sierra-api/v6/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok)
    throw new Error(
      `Failed to fetch auth token: ${response.status} ${response.statusText}`
    );
  const data = (await response.json()) as { access_token: string };
  const token: string = data.access_token;
  return token;
}

export async function getPatronID(barcode: string): Promise<number> {
  const authToken = await getAuthToken();
  const response = await fetch(
    `${sierraApiBaseUrl}/iii/sierra-api/v6/patrons/find?varFieldTag=b&varFieldContent=${barcode}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );

  if (!response.ok)
    throw new Error(
      `Failed to fetch patron ID for barcode ${barcode}: ${response.status} ${response.statusText}`
    );

  const data = (await response.json()) as { id?: number };
  if (!data.id) throw new Error(`No patron found for barcode ${barcode}`);
  const patronId: number = data.id;
  return patronId;
}

export async function getPatronData(patronId: number): Promise<SierraPatron> {
  const authToken = await getAuthToken();
  const fields = "names,birthDate,addresses,emails,patronType,patronCodes";
  const response = await fetch(
    `${sierraApiBaseUrl}/iii/sierra-api/v6/patrons/${patronId}?fields=${fields}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );

  if (!response.ok)
    throw new Error(
      `Failed to fetch patron data for ID ${patronId}: ${response.status} ${response.statusText}`
    );

  return (await response.json()) as SierraPatron;
}

export async function verifyPatronData(
  barcode: string,
  patron: PatronData,
  address: AddressData,
  expectedPatronType: number
): Promise<void> {
  const patronID = await getPatronID(barcode);
  const patronData = await getPatronData(patronID);

  const SUBSCRIBED_ECOMMUNICATIONS_PREF = "s";
  const NOT_SUBSCRIBED_ECOMMUNICATIONS_PREF = "-";

  expect(patronData, "API response must be a valid object").toEqual(
    expect.objectContaining({
      names: expect.any(Array),
      emails: expect.any(Array),
      addresses: expect.any(Array),
      birthDate: expect.any(String),
      patronCodes: expect.objectContaining({ pcode1: expect.any(String) }),
      patronType: expect.any(Number),
    })
  );
  expect(
    patronData.names.length,
    "Names array should not be empty"
  ).toBeGreaterThan(0);
  expect(patronData.birthDate, "Birthdate should not be empty").toBeTruthy();
  expect(
    patronData.emails.length,
    "Emails array should not be empty"
  ).toBeGreaterThan(0);
  expect(
    patronData.patronCodes?.pcode1,
    "Ecommunications preference code should be either 's' or '-'"
  ).toContain(
    SUBSCRIBED_ECOMMUNICATIONS_PREF || NOT_SUBSCRIBED_ECOMMUNICATIONS_PREF
  );
  expect(
    patronData.addresses.length,
    "Addresses array should not be empty"
  ).toBeGreaterThan(0);

  const expectedName = `${patron.lastName}, ${patron.firstName}`.toUpperCase();
  const expectedBirthdate = formatSierraDate(patron.dateOfBirth);
  const expectedEmail = patron.email.toLowerCase();
  const expectedEcommsPref = patron.ecommunicationsPref
    ? SUBSCRIBED_ECOMMUNICATIONS_PREF
    : NOT_SUBSCRIBED_ECOMMUNICATIONS_PREF;
  const expectedAddress = createFuzzyMatcher([
    address.street,
    address.apartmentSuite,
    address.city,
    address.state,
    address.postalCode,
  ]);
  const actualName = patronData.names?.[0].toUpperCase();
  const actualEmails = patronData.emails?.map((email) => email.toLowerCase());
  const actualEcommsPref = patronData.patronCodes?.pcode1;
  const actualAddress = (patronData.addresses?.[0]?.lines || []).join(" ");

  expect(actualName).toContain(expectedName);
  expect(patronData.birthDate).toBe(expectedBirthdate);
  expect(actualEmails).toContain(expectedEmail);
  expect(actualAddress).toMatch(expectedAddress);
  expect(patronData.patronType).toBe(expectedPatronType);
  expect(actualEcommsPref).toBe(expectedEcommsPref);
}

export async function deletePatron(patronId: number): Promise<void> {
  const authToken = await getAuthToken();
  const response = await fetch(
    `${sierraApiBaseUrl}/iii/sierra-api/v6/patrons/${patronId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );

  if (!response.ok)
    throw new Error(
      `Failed to delete patron ${patronId}: ${response.status} ${response.statusText}`
    );
}
