import { PrismaClient, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
const prisma = new PrismaClient();
type AuthRequest = Request & { user?: User };
export const authMiddelweare = async (
  request: AuthRequest,
  response: Response,
  next: NextFunction
) => {
  const authHeader = request.headers["authorization"];
  const jwtToken = authHeader?.split(" ")[1];
  console.log(jwtToken);
  if (!jwtToken) {
    response.status(401).json({ message: "Unauthorized" });
    return;
  }

  //decode the jwt token
  try {
    const decodedToken = await jwt.verify(jwtToken, process.env.JWT_SECRATE!);
    // Check if decodedToken is of type JwtPayload and has a tokenId
    if (typeof decodedToken !== "object" || !("tokenId" in decodedToken)) {
      response.status(401).json({ message: "Invalid token" });
      return;
    }
    // find tokenId
    const dbToken = await prisma.token.findUnique({
      where: {
        id: decodedToken.tokenId,
      },
      include: {
        user: true,
      },
    });
    // validations
    if (!dbToken?.validate || dbToken?.expiration < new Date()) {
      response.status(401).json({ message: "Token is expired token" });
    }

    console.log(dbToken?.user);
    // response.sendStatus(200);
    request.user = dbToken?.user;
    next()
    return;
  } catch (error) {
    response.sendStatus(401).json({ message: "Unauthorized", error });
    next()
  }
//   next();
};
