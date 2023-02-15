import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json("Works fine");
});

app.listen(8000, "localhost", () => console.log("Server running on http://localhost:8000"));