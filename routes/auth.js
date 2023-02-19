import {Router} from "express";
import {login, logout, register} from "../controllers/auth.js";

export const authRouter = Router();

authRouter
.post("/login", login)
.post("/logout", logout)
.post("/register", register);