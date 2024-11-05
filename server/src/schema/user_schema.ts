import { z } from "zod";

export const UserCreateInput = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Please enter a valid email address"),
  username: z
    .string()
    .max(50, "username should be at most 50 character")
    .nullable(),
  name: z.string().max(50, "name should be at most 50 character").nullable(),
});

// export type UserCreate = z.infer<typeof UserCreateInput>;
