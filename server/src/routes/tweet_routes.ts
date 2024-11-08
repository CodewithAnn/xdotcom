import { Prisma, PrismaClient } from "@prisma/client";
import { Router, Request, Response } from "express";
import { TweetCreate } from "../schema/tweet_schema.js";

const tweetRouter = Router();
const prisma = new PrismaClient();
// .$extends({
//   query: {
//     tweet: {
//       create({ args, query }) {
//         args.data = TweetCreate.parse(args.data);
//         return query(args);
//       },
//     },
//   },
// });

// create tweet
tweetRouter.post("/", async (request: Request, response: Response) => {
  const body = TweetCreate.parse(request.body);
  const { content } = body;
 
  try {
    // const { content, userId } = body;

    const tweet = await prisma.tweet.create({
      data: {
        content: content,
        ///[user]  maps tweet to user id forming the relationship
        user: {
          connect: { id: userId },
        },
      },
    });
    response.status(201).json({ content });
    return;
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

// get list of tweets
tweetRouter.get("/", async (request: Request, response: Response) => {
  try {
    const tweets = await prisma.tweet.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            isVerified: true,
          },
        },
      },
    });
    response.json(tweets);
    return;
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

// get tweet by id
tweetRouter.get("/:id", async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const tweet = await prisma.tweet.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });
    if (!tweet) {
      response.status(404).json({ message: "Tweet not found" });
      return;
    }
    response.json({ data: tweet });
    return;
  } catch (error) {
    response.status(500).json({ error: error });
    return;
  }
});
// update tweets
// tweetRouter.put("/:id", async (request: Request, response: Response) => {
//   const { id } = request.params;
//   response.json("successfully updated");
// });

// delete tweet
tweetRouter.delete("/:id", async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const deleteTweet = await prisma.tweet.delete({
      where: { id: Number(id) },
    });
    if (!deleteTweet) {
      response.json({ message: "Tweet not found" });
      return;
    }
    response.json("Delete successfully");
    return;
  } catch (error) {
    // response.json({ error: error });
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      response.status(400).json({ message: error.meta });
      // throw error;
      return;
    }

    response.status(500).json({ Message: "Something happen bad" });
    return;
  }
});

export default tweetRouter;
