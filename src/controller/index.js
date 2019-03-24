import { Router } from "express";
import users from "./users";

const router = Router();
router.get("/", (req, res) => res.send("Welcome to Frontend Social API"));
router.use("/users", users);

export default router;
