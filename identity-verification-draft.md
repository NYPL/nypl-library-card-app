# Identity Verification POC

## Verification Flows

### Client --> Nexstjs API routes --> Vendor Service --> Vendor API

There are three flows depending on the patron's age and location.

### Flow 1 — Teen (age 13–17): Email fraud check

Patron submits Step 1 (`/personal`) and age is between 13 and 18.

**What happens:**

1. Before navigating to the next step, call a server-side API route that sends the submitted email address to the Persona email risk API.
1. Log or display the result
1. Render the API response payload on the apge
1. Continue to the next step regardless of the result

---

### Flow 2 — Adult (≥= 18) in New York: Database check

Patron submits Step 2 (`/address`), their age is ≥= 18, and the resolved address is in NY state.

**What happens:**

1. Call a server-side API route that sends patron data to a database lookup (identity DB check).
1. Store the response in global form state.
1. Log or display the result
1. Continue to the next step (address verification or account)

---

### Flow 3 — Adult (≥= 18) outside New York: Document upload

Patron submits Step 2 (`/address`), their age is ≥= 18, and the resolved address is **not** in NY state.

**What happens:**

1. Route the patron to a new page (`/identity-verification`) instead of `/alternate-address`.
1. On that page, render the ID vendor hosted flow / SDK for document upload (government ID, passport, etc.).
1. Wait for the SDK callback with the result.
1. Store the result and route to the existing next step, if applicable (`/alternate-address`).
1. Display the raw response result on the page
1. Continue to the next step (address verification or account)

\*\*The ID vendor SDK is client-side only, may need to think about how to do that on Nextjs

**I think we can replace the alternate-address page with this identity-verification page**

---

## Technical Implementations

### Server-side API routes for all vendor calls

All three flows call internal Next.js API routes instead of going through PCS backend (e.g. `pages/api/identity-verification/`), which in turn call the ID vendor.

```
  - POST /api/identity-verification/email-check
  - POST /api/identity-verification/db-check
  - (SDK callback) POST /api/identity-verification/document-check
      - Persona API (server-to-server)
```

### Feature flags via environment variables

To trial another vendor, we can use environment variables to control which vendor is used and whether the feature is enabled at all. The feature flag will be a `NEXT_PUBLIC_` variable so that it can be read in the client bundle. However, this is optional and don't need to be included

```bash
NEXT_PUBLIC_ENABLE_ID_VERIFICATION=true
ID_VERIFICATION_PROVIDER=
PERSONA_API_KEY=
```

---

## Files to Create

| File                                                | Purpose                     |
| --------------------------------------------------- | --------------------------- |
| `src/services/identityVerification/persona.ts`      | Vendor API implementation   |
| `src/services/identityVerification/index.ts`        | Vendor factory              |
| `pages/api/identity-verification/email-check.ts`    | Flow 1 API route            |
| `pages/api/identity-verification/db-check.ts`       | Flow 2 API route            |
| `pages/api/identity-verification/document-check.ts` | Flow 3 SDK callback         |
| `pages/identity-verification/index.tsx`             | Flow 3 document upload page |

---

## Deployment

- Work on a dedicated feature branch (e.g. `identity-verification-poc`)
  - Each vendor will have its own feature branch against this base feature branch
- Deploy preview builds to Vercel
- When trialing a second vendor, branch off the same feature branch.. only the service layer changes

---

## Prerequisites / Before We Can Start

- Age and email check will need to be implemented given it will be needed for all three flows
- Answer to: Do we need the alternate-address page at all, or can we replace it with the identity-verification page?
  - We will remove the alternate-address page for now
- Webhook vs. synchronous callback confirmed for Flow 3
- Create all suggested files and folders
- Vendor account and API keys are ready
  - What is the API/trail duration
- Do we have a point of contact at the vendor for questions and support?
- We will have a few paring session if we need
