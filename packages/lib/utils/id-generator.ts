import { createHmac, randomUUID } from "crypto";

// ─── ID Format ────────────────────────────────────────────────────────────────
// {GOV_SCOPE}-{CO_CODE}-{TYPE}-{CAT}-{YEAR}-{SEQ}
// Example: GOI-MHT001-R-ELEC-2025-00000001

const HMAC_SECRET = process.env.QR_HMAC_SECRET ?? "change-in-production";

export interface IdParts {
  govScope: string;   // GOI | MH | DL | KA ...
  companyCode: string; // 6-char alphanumeric
  productType: "R" | "D"; // Reusable | Disposable
  category: string;   // 4-char: ELEC, FURN, TEXT, PLMB, MECH, FOOD ...
  mfgYear: number;
  sequence: number;
}

export function generateProductId(parts: IdParts): string {
  const seq = String(parts.sequence).padStart(8, "0");
  return [
    parts.govScope.toUpperCase(),
    parts.companyCode.toUpperCase(),
    parts.productType,
    parts.category.toUpperCase().slice(0, 4),
    parts.mfgYear,
    seq,
  ].join("-");
}

export function parseProductId(uniqueId: string): IdParts | null {
  const parts = uniqueId.split("-");
  if (parts.length !== 6) return null;
  const [govScope, companyCode, productType, category, year, seq] = parts;
  if (productType !== "R" && productType !== "D") return null;
  return {
    govScope,
    companyCode,
    productType,
    category,
    mfgYear: parseInt(year),
    sequence: parseInt(seq),
  };
}

// ─── QR Payload Signing ───────────────────────────────────────────────────────

export interface QrPayload {
  uid: string;       // unique product ID
  pid: string;       // product DB id (UUID)
  t: number;         // issued timestamp
  jti: string;       // unique token id
}

export function signQrPayload(payload: QrPayload): string {
  const data = JSON.stringify(payload);
  const encoded = Buffer.from(data).toString("base64url");
  const sig = createHmac("sha256", HMAC_SECRET).update(encoded).digest("base64url");
  return `${encoded}.${sig}`;
}

export function verifyQrPayload(token: string): QrPayload | null {
  try {
    const [encoded, sig] = token.split(".");
    if (!encoded || !sig) return null;
    const expectedSig = createHmac("sha256", HMAC_SECRET)
      .update(encoded)
      .digest("base64url");
    if (sig !== expectedSig) return null; // tamper detected
    const data = Buffer.from(encoded, "base64url").toString("utf-8");
    return JSON.parse(data) as QrPayload;
  } catch {
    return null;
  }
}

export function newQrPayload(uid: string, pid: string): QrPayload {
  return { uid, pid, t: Date.now(), jti: randomUUID() };
}

// ─── Company Code Generator ───────────────────────────────────────────────────

export function generateCompanyCode(stateCode: string, sequence: number): string {
  const code = String(sequence).padStart(3, "0");
  return `${stateCode.toUpperCase().slice(0, 3)}${code}`;
}
