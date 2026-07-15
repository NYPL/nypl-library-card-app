/* eslint-disable camelcase */
export const PERSONA_API_URL = "https://api.withpersona.com/api/v1";
export const PERSONA_VERSION = "2025-10-27";

const PERSONA_API_KEY = process.env.PERSONA_API_KEY;
const EMAIL_REPORT_TEMPLATE_ID = process.env.PERSONA_EMAIL_REPORT_TEMPLATE_ID;
const INQUIRY_TEMPLATE_ID = process.env.NEXT_PUBLIC_PERSONA_INQUIRY_TEMPLATE_ID;
const ADDRESS_REPORT_TEMPLATE_ID =
  process.env.PERSONA_ADDRESS_REPORT_TEMPLATE_ID;

export interface PersonaInquiry {
  id: string;
  attributes: {
    status: "created" | "pending" | "completed" | "failed" | string;
    [key: string]: any;
  };
}

export interface UserData {
  "name-first": string;
  "name-last": string;
  birthdate?: string;
}

export interface CreateInquiryResult {
  inquiry_id: string;
  session_token: string | null;
}

export type ReportStatus = "pending" | "ready" | "failed" | "errored";

export interface CreateReportResult {
  report_id: string;
  status: ReportStatus;
  attributes: Record<string, any>;
}

export function getPersonaHeaders(): Record<string, string> {
  if (!PERSONA_API_KEY) {
    console.warn("Warning: PERSONA_API_KEY is not set.");
  }
  return {
    Authorization: `Bearer ${PERSONA_API_KEY}`,
    "Content-Type": "application/json",
    "Persona-Version": PERSONA_VERSION,
  };
}

export async function findIncompleteInquiry(
  userId: string
): Promise<PersonaInquiry | null> {
  const params = new URLSearchParams({
    "filter[reference-id]": userId,
    "filter[status]": "created,pending",
    "page[size]": "1",
  });

  const response = await fetch(
    `${PERSONA_API_URL}/inquiries?${params.toString()}`,
    { method: "GET", headers: getPersonaHeaders() }
  );

  if (!response.ok) {
    throw new Error(`Persona API returned code ${response.status}`);
  }

  const json = await response.json();
  const inquiries = (json.data as PersonaInquiry[]) || [];
  return inquiries.length > 0 ? inquiries[0] : null;
}

export async function createInquiry(
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
    headers: getPersonaHeaders(),
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

export async function createSessionToken(
  inquiryId: string
): Promise<string | null> {
  const response = await fetch(
    `${PERSONA_API_URL}/inquiries/${inquiryId}/resume`,
    {
      method: "POST",
      headers: getPersonaHeaders(),
      body: JSON.stringify({ meta: {} }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to create session token (${response.status})`);
  }

  const json = await response.json();
  return json.meta?.["session-token"] || null;
}

export async function getInquiryStatus(
  inquiryId: string
): Promise<{ status: string; attributes: Record<string, any> }> {
  const response = await fetch(`${PERSONA_API_URL}/inquiries/${inquiryId}`, {
    method: "GET",
    headers: getPersonaHeaders(),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to fetch inquiry (${response.status}): ${errorBody}`
    );
  }

  const json = await response.json();
  return {
    status: json.data.attributes.status,
    attributes: json.data.attributes,
  };
}

export async function createEmailReport(
  email: string
): Promise<CreateReportResult> {
  const response = await fetch(`${PERSONA_API_URL}/reports`, {
    method: "POST",
    headers: getPersonaHeaders(),
    body: JSON.stringify({
      data: {
        type: "report/email-address",
        attributes: {
          "report-template-id": EMAIL_REPORT_TEMPLATE_ID,
          query: { "email-address": email },
        },
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to create email report (${response.status}): ${errorBody}`
    );
  }

  const json = await response.json();
  return {
    report_id: json.data.id,
    status: json.data.attributes.status,
    attributes: json.data.attributes,
  };
}

export async function createAddressReport(address: {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
}): Promise<CreateReportResult> {
  const response = await fetch(`${PERSONA_API_URL}/reports`, {
    method: "POST",
    headers: getPersonaHeaders(),
    body: JSON.stringify({
      data: {
        type: "report/address-lookup",
        attributes: {
          "report-template-id": ADDRESS_REPORT_TEMPLATE_ID,
          query: {
            "address-street-1": address.street1,
            ...(address.street2 && { "address-street-2": address.street2 }),
            "address-city": address.city,
            "address-subdivision": address.state,
            "address-postal-code": address.zip,
            "address-country-code": "US",
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to create address report (${response.status}): ${errorBody}`
    );
  }

  const json = await response.json();
  return {
    report_id: json.data.id,
    status: json.data.attributes.status,
    attributes: json.data.attributes,
  };
}

export async function getReportStatus(
  reportId: string
): Promise<CreateReportResult> {
  const response = await fetch(`${PERSONA_API_URL}/reports/${reportId}`, {
    method: "GET",
    headers: getPersonaHeaders(),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to fetch report (${response.status}): ${errorBody}`
    );
  }

  const json = await response.json();
  return {
    report_id: reportId,
    status: json.data.attributes.status,
    attributes: json.data.attributes,
  };
}
