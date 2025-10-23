require("dotenv").config({ path: ".env.local" });

async function getAuthToken() {
  const response = await fetch(
    "https://nypl-sierra-test.nypl.org/iii/sierra-api/v6/token",
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authorization: `Basic ${process.env.SIERRA_BASIC_AUTH_BASE64}`,
      },
    }
  );
  return response;
}

(async () => {
  try {
    const response = await getAuthToken();
    if (!response.ok) {
      console.error(
        `Failed to get auth token: ${response.status} ${response.statusText}`
      );
      return;
    }
    const data = await response.json();
    const authToken = data.access_token;
    if (authToken) {
      console.log("Auth Token:", authToken);
    } else {
      console.error("Auth token not found in response, received data:", data);
    }
  } catch (err) {
    console.error("Error fetching or parsing auth token:", err);
  }
})();
