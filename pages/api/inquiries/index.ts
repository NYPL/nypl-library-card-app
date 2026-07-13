/* eslint-disable camelcase */
import type { NextApiRequest, NextApiResponse } from "next";

const PERSONA_API_KEY =
  process.env.PERSONA_API_KEY ||
  "PERSONA_SANDBOX_API_KEY_REDACTED";
const PERSONA_API_URL = "https://api.withpersona.com/api/v1";
const PERSONA_VERSION = "2025-10-27";
const INQUIRY_TEMPLATE_ID = "itmpl_AouGvtzJEmTdtsTuD17qjJYxcLNBiB";

interface PersonaInquiry {
  id: string;
  attributes: {
    status: "created" | "pending" | "completed" | "failed" | string;
    [key: string]: any;
  };
}

interface UserData {
  "name-first": string;
  "name-last": string;
  birthdate?: string;
}

interface SuccessResponse {
  inquiry_id: string;
  session_token: string | null;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

function getReqHeaders(): Record<string, string> {
  if (!PERSONA_API_KEY) {
    console.warn("Warning: PERSONA_API_KEY environment variable is not set.");
  }
  return {
    Authorization: `Bearer ${PERSONA_API_KEY}`,
    "Content-Type": "application/json",
    "Persona-Version": PERSONA_VERSION,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { firstName, lastName, birthdate, email } = req.body as {
      firstName: string;
      lastName: string;
      birthdate?: string;
      email: string;
    };

    const userId = email;

    const userData: UserData = {
      "name-first": firstName,
      "name-last": lastName,
      ...(birthdate && { birthdate }),
    };

    const existing = await findIncompleteInquiry(userId);

    if (existing) {
      const inquiryId = existing.id;
      const status = existing.attributes.status;

      console.log(`Found existing inquiry ${inquiryId} with status: ${status}`);

      if (status === "pending") {
        console.log("Inquiry is pending, generating session token to resume");
        const sessionToken = await createSessionToken(inquiryId);

        return res.status(200).json({
          inquiry_id: inquiryId,
          session_token: sessionToken,
        });
      } else {
        console.log("Inquiry is created, continuing without session token");
        return res.status(200).json({
          inquiry_id: inquiryId,
          session_token: null,
        });
      }
    } else {
      // Create a brand new inquiry
      console.log("No incomplete inquiry found, creating new one");
      const inquiryId = await createInquiry(userId, userData);

      return res.status(200).json({
        inquiry_id: inquiryId,
        session_token: null,
      });
    }
  } catch (error: any) {
    console.error("API Route Error:", error?.message || error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error?.message,
    });
  }
}

async function findIncompleteInquiry(
  userId: string
): Promise<PersonaInquiry | null> {
  try {
    const params = new URLSearchParams({
      "filter[reference-id]": userId,
      "filter[status]": "created,pending",
      "page[size]": "1",
    });

    const response = await fetch(
      `${PERSONA_API_URL}/inquiries?${params.toString()}`,
      {
        method: "GET",
        headers: getReqHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Persona API returned code ${response.status}`);
    }

    const json = await response.json();
    const inquiries = (json.data as PersonaInquiry[]) || [];
    return inquiries.length > 0 ? inquiries[0] : null;
  } catch (error) {
    console.error(`Error finding inquiry:`, error);
    return null;
  }
}

async function createInquiry(
  userId: string,
  userData: UserData
): Promise<string> {
  const payload = {
    data: {
      attributes: {
        "inquiry-template-id": INQUIRY_TEMPLATE_ID,
        "reference-id": userId,
        fields: userData,
      },
    },
  };

  const response = await fetch(`${PERSONA_API_URL}/inquiries`, {
    method: "POST",
    headers: getReqHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to create inquiry (${response.status}): ${errorBody}`
    );
  }

  const json = await response.json();
  return json.data.id;
}

async function createSessionToken(inquiryId: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${PERSONA_API_URL}/inquiries/${inquiryId}/resume`,
      {
        method: "POST",
        headers: getReqHeaders(),
        body: JSON.stringify({ meta: {} }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to create resume session token (${response.status})`
      );
    }

    const json = await response.json();
    return json.meta?.["session-token"] || null;
  } catch (error) {
    console.error(`Error creating session token:`, error);
    return null;
  }
}
