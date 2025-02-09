import { NextFunction, Request, Response } from "npm:express";
import { verify } from "./jwt.ts"; // Import verify function from jwt.ts

export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers["x-observatory-auth"] as string;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify the token using the existing verify function
    const decoded = await verify(token);
    req.user = decoded; // Attach user details to request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Authentication Error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
}
