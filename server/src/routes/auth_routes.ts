import { PrismaClient } from "@prisma/client";
import { table } from "console";
import { Request, Router, Response, response } from "express";
import jwt from "jsonwebtoken";
// import "dotenv/config";

const authRoute = Router();
const prisma = new PrismaClient();

// "/login" route checks for the email address of the
// user If user has same email as in database then it will
// generates a token for user and save it to database otherwise
// it crates a user first into the database and then generates
// a token for user.

// generate token for user
const generateToken = function () {
  return Math.floor(Math.random() * 900000);
};
// time of expiration of token in minutes
const tokenExpirationTime = 5;
const tokenExpirationDay = 3;
authRoute.post("/login", async (request: Request, response: Response) => {
  try {
    const { email } = request.body;
    const emailToken = generateToken();
    /**
      [const tokenExpiration = new Date(new Date().getTime()+tokenExpirationTime*60*1000)]
      this presents:::::
       const tokenExpiration = new Date(new Date().getTime()+5*60*1000) ---> 
                                5minutes*60Seconds*1000milliseconds (you get your time in milliseconds)

     */
    const tokenExpiration = new Date(
      new Date().getTime() + tokenExpirationTime * 60 * 1000
    );
    const crateToken = await prisma.token.create({
      data: {
        type: "EMAIL",
        emailToken: emailToken,
        expiration: tokenExpiration,
        user: {
          /**
           * when user sends his/her email, then here we fist find it in our
           * database, if present then, create a new token using that user id
           * if not then first create a new user and then create a new token
           */
          connectOrCreate: {
            where: {
              email: email,
            },
            create: { email: email },
          },
        },
      },
    });
    console.log("Create token :::", await crateToken.emailToken);
    response
      .status(201)
      .json({ message: "Token generated", token: crateToken });
    return;
  } catch (error) {
    response.status(400).json({ message: "Something happen bad" });
    console.log(error);
    return;
  }
});

// [/authenticate] it authenticate the email and token provided
// by user according to checks it returns the response
authRoute.post(
  "/authenticate",
  async (request: Request, response: Response) => {
    console.table(request.body);
    // generate JWT Token
    const secretKey = process.env.JWT_SECRATE!;
    function generateJwtToken(tokenId: number): string {
      // const payload = { tokenId };
      return jwt.sign({ tokenId }, secretKey);
    }
    try {
      const { email, token } = request.body;
      const apiToken = generateToken();

      // checks the email and token in DB
      // const numberToken = Number(token);
      const checkToken = await prisma.token.findUnique({
        where: {
          // emailToken:Number (token),
          emailToken: Number(token),
        },
        include: {
          /// user credentials using the id to show email for validation purposes
          user: true,
        },
      });
      console.log(checkToken);
      //validation

      // if token not found or token is invalid
      if (!checkToken || !checkToken.validate) {
        response.status(401).json({
          message: "Invalid token or email",
        });
        return;
      }
      //if token is expired
      if (checkToken.expiration < new Date()) {
        response.status(401).json({ message: "token expired" });
        return;
      }
      // if everything is okay last check for user emails if its matches then go ahead
      if (checkToken.user?.email != email) {
        response.status(401).json({ message: "Access denied" });
        return;
      }
      // Todo:
      //  create Api token
      const tokenExpirationInDays = new Date(
        new Date().getTime() + tokenExpirationDay * 24 * 60 * 60 * 1000
      );
      const authenticateToken = await prisma.token.create({
        data: {
          type: "API-TOKEN",
          expiration: tokenExpirationInDays,

          user: {
            connect: { email: email },
          },
        },
      });

      // mark invalid EMAIL token when token is used
      await prisma.token.update({
        where: { id: checkToken.id },
        data: { validate: false },
      });
      // create JWT token and send it to user
      const jwtToken = generateJwtToken(authenticateToken.id);
      //
      response.status(200).json({ token: jwtToken });
      return;
    } catch (error) {
      response
        .status(400)
        .json({ message: "Something happened wrong", error: error });
      console.log(error);
      return;
    }
  }
);

export default authRoute;
