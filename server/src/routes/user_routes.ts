import { Request, Response, Router } from "express";
import { rmSync } from "fs";

const router = Router();
/// all the user routes here we don't need to follow the legacy
/// Ruby on rails routes system here

router.post("/", async (request: Request, response: Response) => {
  const { name } = request.body;
  response.json({ created: "ok", name });
});

// route for get list of users
router.get("/", async (request: Request, response: Response) => {
  response.status(200).json();
});

// get user by id
router.get("/:id", async (request: Request, response: Response) => {
  const { id } = request.params;
  response.status(200).json({ id });
});

// update user
router.put("/:id", async (request: Request, response: Response) => {
  const { id } = request.params;
  response.json(id);
});
// delete user
router.delete("/:id", async (request: Request, response: Response) => {
  const { id } = request.params;
  response.json(`successfully ${id} deleted`);
});

export default router;
