import express, { Request, Response } from "express";
import router from "./routes/user_routes.js";
import tweetRouter from "./routes/tweet_routes.js";
import authRoute from "./routes/auth_routes.js";
import "dotenv/config";
import { authMiddelweare } from "./middleweare/auth_middleweare.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use("/api/v1/user", authMiddelweare, router);
app.use("/api/v1/tweet", authMiddelweare, tweetRouter);
app.use("/api/v1/auth", authRoute);
// app.get("/", (req: Request, res: Response) => {
//   res.send("Server Template");
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
