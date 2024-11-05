import { z } from "zod";

export const TweetCreate = z.object({
  content: z.string().max(300),
});

