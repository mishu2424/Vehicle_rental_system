import { Router } from "express";
import { authControllers } from "./auth.controller";

const router=Router();

// signup users
router.post("/signup",authControllers.signUpUsers);

// signin
router.post("/signin",authControllers.signInUsers);

export const authRouter=router;