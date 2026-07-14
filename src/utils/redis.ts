import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default redis;

export function inquiryKey(inquiryId: string): string {
  return `persona:inquiry:${inquiryId}`;
}

export function reportKey(reportId: string): string {
  return `persona:report:${reportId}`;
}

export const KEY_TTL_SECONDS = 60 * 60 * 24;
