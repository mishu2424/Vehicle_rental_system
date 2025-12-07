import { Router } from "express";
import { userControllers } from "./users.controller";
import auth from "../../middleware/auth";

const router = Router();

// get all users
router.get("/", auth("admin"), userControllers.getUsers);

// get single user
router.put("/:userId", auth("admin", "customer"), userControllers.updateUser);

// delete user
router.delete("/:userId", auth("admin"), userControllers.deleteUser);

export const usersRouter = router;
