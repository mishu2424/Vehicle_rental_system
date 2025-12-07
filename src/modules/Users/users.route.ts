import { Router } from "express";
import { userControllers } from "./users.controller";
import auth from "../../middleware/auth";
import { Role } from "../authentication/auth.constant";

const router = Router();

// get all users
router.get("/", auth(Role.Admin), userControllers.getUsers);

// get single user
router.put("/:userId", auth(Role.Admin, Role.Customer), userControllers.updateUser);

// delete user
router.delete("/:userId", auth(Role.Admin), userControllers.deleteUser);

export const usersRouter = router;
