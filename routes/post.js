import {Router} from "express";
import {addPost} from "../controllers/post.js"; 

export const postRouter = Router();

postRouter.get("/", addPost);