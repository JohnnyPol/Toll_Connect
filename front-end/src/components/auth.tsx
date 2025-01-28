import jwtDecode from "https://esm.sh/jwt-decode@3.1.2";
import { Token, UserLevel } from "@/components/login-form.tsx";

export function isAuthenticated(userLevel: UserLevel): boolean {
  const token = localStorage.getItem("authToken");

  if (!token) return false;

  try {
    const decodedToken: Token = jwtDecode(token);

    // Check expiration time
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    if (decodedToken.exp < currentTime) {
      console.error("Token has expired");
      return false; // Token has expired
    }

    // Check user level
    if (decodedToken.level !== userLevel) {
      console.error("Invalid user");
      return false; // User level doesn't match
    }

    return true; // Token is valid for the required level
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
}
