let authToken: string | null = null;
let response: Response | null = null;

const sierraTestURL = "https://nypl-sierra-test.nypl.org";

export async function getToken(): Promise<string | null> {
  const request = new Request(`${sierraTestURL}/iii/sierra-api/v6/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${process.env.SIERRA_BASIC_AUTH_BASE64}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  try {
    response = await fetch(request);

    if (response.status !== 200) {
      const errorText = await response.text();
      console.error(
        `API Error ${response.status}: ${response.statusText}`,
        errorText
      );
      throw new Error("Failed to get auth token from API server.");
    }

    const data = await response.json();

    authToken = data.access_token;
    console.log("Auth Token (Success):", authToken);

    return authToken;
  } catch (error) {
    console.error("Error fetching auth token:", error);
    return null;
  }
}

getToken().then((token) => {
  if (token) {
    console.log("Token successfully retrieved.");
  } else {
    console.log("Token retrieval failed.");
  }
});
