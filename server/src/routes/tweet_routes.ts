import { Router, Request, Response } from "express";
const tweetRouter = Router();

// create tweet
tweetRouter.post("/", async (request: Request, response: Response) => {
  const { content } = request.body;
  response.json(content);
});

// get list of tweets
tweetRouter.get("/", async (request: Request, response: Response) => {
  response.json("List of tweets");
});

// get tweet by id
tweetRouter.get("/:id", async (request: Request, response: Response) => {
  const { id } = request.params;
  response.json(id);
});
// update tweets
tweetRouter.put("/:id", async (request: Request, response: Response) => {
  const { id } = request.params;
  response.json("successfully updated");
});

// delete tweet
tweetRouter.delete("/:id", async (request: Request, response: Response) => {
  const { id } = request.params;
  response.json("Delete successfully");
});

export default tweetRouter;
