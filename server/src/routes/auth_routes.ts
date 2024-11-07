import { PrismaClient } from "@prisma/client";
import { table } from "console";
import { Request, Router, Response } from "express";

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

export default authRoute;
