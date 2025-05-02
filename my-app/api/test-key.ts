import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.MISTRAL_API_KEY;
  res.status(200).json({ key: apiKey });
}
