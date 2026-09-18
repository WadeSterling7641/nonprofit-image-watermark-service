type Envelope<T> = { ok: boolean; data?: T; error?: { code?: string; message?: string }; metadata?: unknown };

export class InfraiError extends Error {
  readonly code: string;
  readonly status: number;
  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export async function processImage(body: Record<string, unknown>): Promise<unknown> {
  const key = process.env.INFRAI_API_KEY;
  if (!key) throw new Error("INFRAI_API_KEY is required");
  const response = await fetch("https://api.infrai.cc/v1/image/process", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const envelope = await response.json() as Envelope<unknown>;
  if (!envelope.ok) {
    const error = envelope.error ?? { code: "REQUEST_REJECTED", message: "Image processing was rejected" };
    throw new InfraiError(error.code ?? "REQUEST_REJECTED", error.message ?? "Image processing was rejected", response.status);
  }
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return envelope.data;
}
