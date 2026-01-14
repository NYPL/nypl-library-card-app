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
  const fields = "names,birthDate,addresses,emails";
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
