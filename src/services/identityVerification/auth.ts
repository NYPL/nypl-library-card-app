/* eslint-disable camelcase */
import axios from "axios";
import qs from "qs";

type TokenCache = {
  accessToken?: string;
  tokenType?: string;
  expiresIn?: number;
  expiresAt?: number;
  scope?: string;
};

export type Token = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  scope?: string;
};

const cache: TokenCache = {};
const TOKEN_EXPIRATION_MS = 60 * 1000;

type TokenResponseData = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  scope?: string;
};

function tokenIsValid() {
  if (
    !cache.accessToken ||
    !cache.tokenType ||
    typeof cache.expiresIn !== "number" ||
    typeof cache.expiresAt !== "number"
  ) {
    return false;
  }

  return Date.now() < cache.expiresAt - TOKEN_EXPIRATION_MS;
}

export async function getBearerToken(): Promise<Token> {
  if (tokenIsValid()) {
    return {
      accessToken: cache.accessToken,
      tokenType: cache.tokenType,
      expiresIn: cache.expiresIn,
      scope: cache.scope,
    };
  }

  const tokenEndpoint = process.env.IDENTITY_VERIFICATION_TOKEN_ENDPOINT;
  const clientId = process.env.IDENTITY_VERIFICATION_CLIENT_ID;
  const clientSecret = process.env.IDENTITY_VERIFICATION_CLIENT_SECRET;

  if (!tokenEndpoint || !clientId || !clientSecret) {
    throw new Error(
      "Missing identity verification token environment variables."
    );
  }

  let tokenResponse;

  try {
    tokenResponse = await axios.post<TokenResponseData>(
      tokenEndpoint,
      qs.stringify({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 10000,
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(
      `Could not fetch identity verification bearer token: ${errorMessage}`
    );
  }

  const accessToken = tokenResponse.data?.access_token;
  if (!accessToken) {
    throw new Error("Token endpoint did not return an access token.");
  }

  const tokenType = tokenResponse.data?.token_type || "Bearer";
  const expiresIn = Number(tokenResponse.data?.expires_in) || 300;
  const scope = tokenResponse.data?.scope;

  cache.accessToken = accessToken;
  cache.tokenType = tokenType;
  cache.expiresIn = expiresIn;
  cache.expiresAt = Date.now() + expiresIn * 1000;
  cache.scope = scope;

  return {
    accessToken,
    tokenType,
    expiresIn,
    scope,
  };
}
