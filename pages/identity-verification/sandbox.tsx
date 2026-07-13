import { useState } from "react";

type ApiResponsePanelProps = {
  label: string;
  data: unknown;
};

function ApiResponsePanel({ label, data }: ApiResponsePanelProps) {
  if (!data) return null;
  const formatted =
    typeof data === "string" ? data : JSON.stringify(data, null, 2);

  return (
    <div style={{ maxWidth: "100%", overflowX: "auto" }}>
      <p>{label}</p>
      <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {formatted}
      </pre>
    </div>
  );
}

export default function IdentityVerificationSandbox() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");

  const [emailCheckResponse, setEmailCheckResponse] = useState<unknown>(null);
  const [dbCheckResponse, setDbCheckResponse] = useState<unknown>(null);
  const [docCheckResponse, setDocCheckResponse] = useState<unknown>(null);

  async function runEmailCheck() {
    const res = await fetch("/api/identity-verification/email-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setEmailCheckResponse(await res.json());
  }

  async function runDbCheck() {
    const res = await fetch("/api/identity-verification/db-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, address }),
    });
    setDbCheckResponse(await res.json());
  }

  // Placeholder until the real SDK is wired up
  function simulateDocCheck() {
    setDocCheckResponse({
      status: "mock",
      note: "Replace with real SDK callback result",
    });
  }

  return (
    <div style={{ padding: "1.5rem", maxWidth: 700, margin: "0 auto" }}>
      <h1>Identity Verification Sandbox</h1>

      <section>
        <h2>Flow 1: Email check</h2>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />
        <button onClick={runEmailCheck}>Run email-check</button>
        <ApiResponsePanel
          label="email-check response"
          data={emailCheckResponse}
        />
      </section>

      <section>
        <h2>Flow 2: DB check</h2>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="first name"
        />
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="last name"
        />
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="address"
        />
        <button onClick={runDbCheck}>Run db-check</button>
        <ApiResponsePanel label="db-check response" data={dbCheckResponse} />
      </section>

      <section>
        <h2>Flow 3: Document check</h2>
        <button onClick={simulateDocCheck}>Simulate SDK callback</button>
        <ApiResponsePanel
          label="document-check response"
          data={docCheckResponse}
        />
      </section>
    </div>
  );
}
