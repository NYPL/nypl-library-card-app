import crypto from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import redis, {
  inquiryKey,
  reportKey,
  KEY_TTL_SECONDS,
} from "../../../src/utils/redis";
import logger from "../../../src/logger";

export const config = { api: { bodyParser: false } };

async function getRawBody(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks as any)));
    req.on("error", reject);
  });
}

function verifySignature(rawBody: Buffer, signature: string): boolean {
  const secret = process.env.PERSONA_WEBHOOK_SECRET;
  if (!secret) return true;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody as any)
    .digest("hex");
  return crypto.timingSafeEqual(
    new Uint8Array(Buffer.from(signature)),
    new Uint8Array(Buffer.from(expected))
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const rawBody = await getRawBody(req);
  const signature = req.headers["persona-signature"] as string;

  if (signature && !verifySignature(rawBody, signature)) {
    logger.warn("Webhook signature mismatch");
    return res.status(401).json({ error: "Invalid signature" });
  }

  const event = JSON.parse(rawBody.toString());
  const eventName: string = event?.data?.attributes?.name ?? event?.type ?? "";
  const payload = event?.data?.attributes?.payload?.data;

  logger.info("Persona webhook received", { eventName });

  if (eventName.startsWith("inquiry.")) {
    const inquiryId: string = payload?.id;
    if (inquiryId) {
      const attributes = payload?.attributes ?? {};
      await redis.set(
        inquiryKey(inquiryId),
        { status: attributes.status, attributes },
        { ex: KEY_TTL_SECONDS }
      );
      logger.info("Cached inquiry status", {
        inquiryId,
        status: attributes.status,
      });
    }
  } else if (
    eventName === "report.created" ||
    eventName === "report.ready" ||
    eventName === "report.errored"
  ) {
    const reportId: string = payload?.id;
    if (reportId) {
      const attributes = payload?.attributes ?? {};
      await redis.set(
        reportKey(reportId),
        { status: attributes.status, attributes },
        { ex: KEY_TTL_SECONDS }
      );
      logger.info("Cached report status", {
        reportId,
        status: attributes.status,
      });
    }
  } else {
    logger.info("Unhandled webhook event", { eventName });
  }

  return res.status(200).json({ received: true });
}
