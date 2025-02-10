import { NextFunction, Request, Response } from "npm:express";
import { verify } from "./jwt.ts"; // Import verify function from jwt.ts

export enum UserLevel {
  Anonymous = 0,
  Operator = 1,
  Admin = 2,
}
export type Token = {
  level: UserLevel;
  name: string;
  exp: number;
};

export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("Request: ", req);
    const token = req.headers["x-observatory-auth"] as string;
    console.log("Token in Header: ", token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify the token using the existing verify function
    const decodedToken = await verify(token);
    console.log("Verified Token Function: ", decodedToken);
    req.user = decodedToken; // Attach user details to request
    let level;
    if (decodedToken.level === UserLevel.Operator) {
      level = "Operator";
    }
    if (decodedToken.level === UserLevel.Admin) {
      level = "Admin";
    }
    req.user.level = level;
    req.user.id = decodedToken.id;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Authentication Error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
}
