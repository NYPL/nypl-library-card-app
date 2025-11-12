const sierraApiBaseUrl = process.env.SIERRA_API_BASE_URL;
const basicAuth = process.env.SIERRA_BASIC_AUTH_BASE64;

if (!sierraApiBaseUrl) {
  throw new Error(
    "Environment variable SIERRA_API_BASE_URL is required but not set."
  );
}
if (!basicAuth) {
  throw new Error(
    "Environment variable SIERRA_BASIC_AUTH_BASE64 is required but not set."
  );
}

export interface SierraToken {
  access_token: string;
}

export interface SierraSearchByBarcode {
  id: number;
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
  const data = await response.json();
  const token = data.access_token;
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
  const patronId = data.id;
  return patronId;
}

export async function deletePatron(barcode: string): Promise<void> {
  const authToken = await getAuthToken();
  const patronID = await getPatronID(barcode);
  const response = await fetch(
    `${sierraApiBaseUrl}/iii/sierra-api/v6/patrons/${patronID}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );

  if (!response.ok)
    throw new Error(
      `Failed to delete patron ${patronID}: ${response.status} ${response.statusText}`
    );
}
