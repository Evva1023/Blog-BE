import {Router} from "express";
import {addPost} from "../controllers/post";

export const postRouter = Router();

postRouter.get("/", addPost);