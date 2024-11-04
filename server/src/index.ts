import express, { Request, Response } from "express";
import router from "./routes/user_routes.js";
import tweetRouter from "./routes/tweet_routes.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use("/api/v1/user", router);
app.use("/api/v1/tweet", tweetRouter);
// app.get("/", (req: Request, res: Response) => {
//   res.send("Server Template");
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
