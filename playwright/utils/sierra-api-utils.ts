require("dotenv").config({
  path: "/Users/bridgetterose/Desktop/nypl-library-card-app/.env.local",
});
const sierraApiBaseUrl = process.env.SIERRA_API_BASE_URL_QA;
const basicAuth = process.env.SIERRA_BASIC_AUTH_BASE64;

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
  const data = await response.json();
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

  const data = await response.json();
  const patronId: number = data.id;
  if (!data.id) throw new Error(`No patron found for barcode ${barcode}`);
  return patronId;
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
