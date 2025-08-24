import { jwtVerify, JWTPayload } from "jose";

export interface UserPayload extends JWTPayload {
  id: number;
  username: string;
  email: string;
  roles?: string[];
}

export function getJwtSecretKey(): Uint8Array {
  const secret = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;

  if (!secret) {
    throw new Error("JWT Secret key is not matched");
  }

  return new TextEncoder().encode(secret);
}

export async function verifyJwtToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());

    // payload'ı UserPayload tipine dönüştürüyoruz
    const userPayload: UserPayload = {
      ...payload,
      id: Number(payload.id) || 0,
      username: String(payload.username || ''),
      email: String(payload.email || ''),
      roles: Array.isArray(payload.roles) ? payload.roles : []
    };

    return userPayload;
  } catch (error) {
    return null;
  }
}