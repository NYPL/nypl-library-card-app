export interface SierraTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export async function getToken(): Promise<string | null> {
  const basicAuth = process.env.SIERRA_BASIC_AUTH_BASE64;

  if (!basicAuth) {
    console.error("SIERRA_BASIC_AUTH_BASE64 environment variable is missing.");
    return null;
  }

  const request = new Request(
    `${process.env.SIERRA_API_BASE_URL_QA}/iii/sierra-api/v6/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },

      body: "grant_type=client_credentials",
    }
  );

  try {
    const response = await fetch(request);

    if (response.status !== 200) {
      const errorText = await response.text();
      console.error(
        `API Error ${response.status}: ${response.statusText}`,
        errorText
      );
      throw new Error(
        `Failed to get auth token from API server. Status: ${response.status} ${response.statusText}. Response: ${errorText}`
      );
    }

    const data: SierraTokenResponse = await response.json();

    const authToken = data.access_token;

    return authToken;
  } catch (error) {
    console.error("Error fetching auth token:", error);
    return null;
  }
}
