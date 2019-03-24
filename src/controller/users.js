import { Router } from "express";
const router = new Router();
import { users, user } from "../mockDb/users";

router.get("/", (req, res) => {
  res.send(users);
});
router.get("/:id", (req, res) => {
  res.send(user);
});

export default router;
