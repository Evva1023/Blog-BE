import {readFile, writeFile} from "fs/promises";
import {v4 as uuid} from "uuid";
import bcrypt from "bcrypt";

const readData = async () => {
    const data = await JSON.parse(await readFile("./data/users.json", "utf-8"));
    return data;
};

const writeData = async (data) => {
    const dataToSave = JSON.stringify(data);
    await writeFile("./data/users.json", dataToSave, "utf-8");
    console.log("Data saved successfully");
};

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

export const login = (req, res) => {};

export const logout = (req, res) => {};

export const register = async (req, res) => {
    const users = await readData();
    const newUserData = req.body;
    const hashedPassword = await hashPassword(req.body.password);

    const checkUsers = async () => {
        await users.find(user => user.email === req.body.email);
    }

    if (checkUsers) {
        res.json("User with this email already exists");
    }

    const newUser = {
        id: uuid(),
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    }

    await writeData(newUser);
    res.json(newUserData, "User saved successfully");
};