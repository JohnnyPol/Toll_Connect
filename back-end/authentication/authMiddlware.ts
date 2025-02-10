import { NextFunction, Request, Response } from "npm:express";
import { verify } from "./jwt.ts"; // Import verify function from jwt.ts
import { UserLevel } from '@/models/toll_operator.ts'; }
import { Token } from '@/authentication/jwt.ts'; }

export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("Request: ", req);
    const token = req.headers as string;
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
