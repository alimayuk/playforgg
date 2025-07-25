import { SignJWT } from "jose";
import { getJwtSecretKey } from "../app/lib/jwtToken";
import Cookies from 'js-cookie';

interface User {
  username: string;
  email: string;
}

export const jwtTokenCreate = async (user: User): Promise<void> => {
  try {
    const token = await new SignJWT({
      username: user.username,
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30m")
      .sign(getJwtSecretKey());

    Cookies.set("c", token, { path: "/" });
  } catch (error) {
    console.error("Error creating JWT:", error);
  }
};
