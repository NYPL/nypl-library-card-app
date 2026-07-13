import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }

  // TODO: replace with real Persona email risk API call once vendor keys are ready
  // const result = await personaService.checkEmailRisk(email);

  const mockResult = {
    email,
    riskLevel: "low",
    flags: [],
    checkedAt: new Date().toISOString(),
  };

  return res.status(200).json(mockResult);
}
