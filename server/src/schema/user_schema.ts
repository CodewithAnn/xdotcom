import { z } from "zod";

export const UserCreateInput = z.object({
  email: z.string().email("Please enter a valid email address"),
  username: z
    .string()
    .max(50, "username should be at most 50 character")
    .nullable(),
  name: z.string().max(50, "name should be at most 50 character").nullable(),
  bio: z.string().max(100, "bio should be at most 100 characters").nullable(),
});

