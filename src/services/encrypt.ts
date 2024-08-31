import crypto from "crypto";

export function encrypt(data: string, key: string) {
  const hash = crypto.createHash("sha256");
  hash.update(key);

  const keyBuffer = hash.digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", keyBuffer, iv);

  const encrypted = Buffer.concat([
    cipher.update(data, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return `${iv.toString("hex")}.${encrypted.toString("hex")}.${tag.toString(
    "hex",
  )}`;
}
