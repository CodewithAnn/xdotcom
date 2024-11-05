import { PrismaClient } from "@prisma/client";
import { query, Request, Response, Router } from "express";
import { rmSync } from "fs";
import { UserCreateInput } from "../schema/user_schema.js";

const router = Router();
/// all the user routes here we don't need to follow the legacy
/// Ruby on rails routes system here
const prisma = new PrismaClient().$extends({
  query: {
    user: {
      create({ args, query }) {
        args.data = UserCreateInput.parse(args.data);
        return query(args);
      },
    },
  },
});

router.post("/", async (request: Request, response: Response) => {
  try {
    console.table(request.body);
    const { email, name, username, bio } = request.body;

    // validate email not empty
    if (!email === null) {
      response.status(400).json({ message: "Email is required" });
      return;
    }
    // if email is not empty then move to the user create
    const user = await prisma.user.create({
      data: {
        email: email,
        name: name,
        username: username,
        bio: bio,
      },
    });
    console.table(user);

    response.status(201).json({ data: user, message: "User created" });
    return;
  } catch (error) {
    response.status(500).json({ error });
    console.log(`OOPs got error::::${error}`);
  }
});

// route for get list of users
router.get("/", async (request: Request, response: Response) => {
  console.log(`Request Body::::: `, request.body);
  try {
    const user = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        bio: true,
        isVerified: true,
      },
    });
    response.status(200).json({ statuscode: 200, data: user });
    return;
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

// get user by id
router.get("/:id", async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!user) {
      response.status(404).json({ message: "User not found." });
      return;
    }
    response.status(200).json({ statuscode: 200, data: user });
    return;
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

// update user
router.put("/:id", async (request: Request, response: Response) => {
  const { id } = request.params;
  try {
    const { email, username, bio, name } = request.body;

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { email: email, username: username, bio: bio, name: name },
    });
    if (!user) {
      response.status(404).json({ message: "User not found." });
      return;
    }
    response.status(200).json({ message: "user updated successfully." });
    return;
  } catch (error) {
    response.status(500).json(error);
  }
});
// delete user
router.delete("/:id", async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const user = await prisma.user.delete({
      where: { id: Number(id) },
    });
    if (!user) {
      response.status(404).json({ message: "User not found." });
      return;
    }
    response.status(200).json({message:`user deleted successfully`});
    return;
  } catch (error) {
    response.status(404).json({ error });
  }
});

export default router;
