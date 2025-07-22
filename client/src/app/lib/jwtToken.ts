import { jwtVerify, JWTPayload } from "jose";

// JWT secret key'ini güvenli şekilde alır ve encode eder
export function getJwtSecretKey(): Uint8Array {
  const secret = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;

  if (!secret) {
    throw new Error("JWT Secret key is not matched");
  }

  return new TextEncoder().encode(secret);
}

// JWT token'ı doğrular ve payload döner, doğrulama başarısızsa null döner
export async function verifyJwtToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload;
  } catch (error) {
    return null;
  }
}
