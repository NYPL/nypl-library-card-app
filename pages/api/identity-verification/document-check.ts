import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const payload = req.body;

  if (!payload) {
    return res.status(400).json({ error: "No payload received" });
  }

  // TODO: replace with real Persona document verification callback handling
  // once vendor SDK integration and webhook/callback decision are finalized

  const mockResult = {
    status: "received",
    payload,
    checkedAt: new Date().toISOString(),
  };

  return res.status(200).json(mockResult);
}
