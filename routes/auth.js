import {Router} from "express";

export const authRouter = Router();

authRouter.get("/", (req, res) => {
    res.json("Login and register path");
});