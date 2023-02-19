import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {authRouter} from "./routes/auth.js";
import {postRouter} from "./routes/post.js";

const app = express();

app.use(express.json());
app.use(cors({origin: "http://localhost:3000"}));
app.use(cookieParser());

app.use("/", authRouter);
app.use("/post", postRouter);

app.listen(8000, "localhost", () => console.log("Server running on http://localhost:8000"));