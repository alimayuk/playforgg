import { SignJWT } from "jose";
import { getJwtSecretKey } from "../app/lib/jwtToken";
import Cookies from 'js-cookie';
import { ClientUser } from "@/types";

export const jwtTokenCreate = async (user: ClientUser): Promise<void> => {
  try {
    const token = await new SignJWT({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
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
