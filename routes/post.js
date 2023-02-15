import {Router} from "express";

export const postRouter = Router();

postRouter.get("/", (req, res) => {
    res.json("Posts fetching path");
});