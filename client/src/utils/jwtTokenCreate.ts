import { SignJWT } from "jose";
import { getJwtSecretKey } from "../app/lib/jwtToken";
import Cookies from 'js-cookie';

interface User {
  name: string;
  email: string;
}

export const jwtTokenCreate = async (user: User): Promise<void> => {
  try {
    const token = await new SignJWT({
      name: user.name,
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30m")
      .sign(getJwtSecretKey());

    Cookies.set("token", token, { path: "/" });
  } catch (error) {
    console.error("Error creating JWT:", error);
  }
};
