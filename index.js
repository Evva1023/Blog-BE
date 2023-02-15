import express from "express";
import {authRouter} from "./routes/auth.js";
import {postRouter} from "./routes/post.js";
import {userRouter} from "./routes/user.js";

const app = express();

app.use(express.json());
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);


app.listen(8000, "localhost", () => console.log("Server running on http://localhost:8000"));