import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { firstName, lastName, address } = req.body;

  if (!firstName || !lastName || !address) {
    return res
      .status(400)
      .json({ error: "firstName, lastName, and address are required" });
  }

  // TODO: replace with real identity DB lookup once vendor/db integration is ready
  // const result = await identityDbService.lookup({ firstName, lastName, address });

  const mockResult = {
    firstName,
    lastName,
    address,
    match: "verified",
    confidence: 0.92,
    checkedAt: new Date().toISOString(),
  };

  return res.status(200).json(mockResult);
}
