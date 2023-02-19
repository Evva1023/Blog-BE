import {readFile, writeFile} from "fs/promises";
import {v4 as uuid} from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const readData = async () => {
    const users = JSON.parse(await readFile("./data/users.json", "utf-8"));
    return users;
};

const writeData = async (data) => {
    const dataToSave = JSON.stringify(data);
    await writeFile("./data/users.json", dataToSave, "utf-8");
};

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

const comparePassword = async (password, hashedPassword) => {
    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordCorrect) {
        return res.status(400).json({message: "Password not correct"});
    }
};

export const login = async (req, res) => {
    const users = await readData();

    console.log(users);

    const userLoginData = req.body;
    console.log(userLoginData);

    const checkUser = await users.find(user => user.username === userLoginData.username);
    console.log(checkUser);

    if (!checkUser) {
        console.log("No such user");
        return;
    }

    comparePassword(userLoginData.password, checkUser.password);
    
    const token = jwt.sign({id: checkUser.id}, "SECRET_KEY_HERE");

    res.cookie("access_token", token, {httpOnly: true}).status(200).json({username: checkUser.username});
    res.status(200).json({message: "OK"});
};


export const logout = (req, res) => {};



export const register = async (req, res) => {
    const users = await readData();
    //console.log("DANE Z PLIKU BAZY DANYCH", users);

    const newUserData = req.body;
    //console.log("DANE NOWEGO USERA Z FORMULARZA",newUserData);
    
    const checkUser = await users.find(user => user.username === req.body.username || user.email === req.body.email);
    //console.log(checkUser.username, checkUser.email);
    if (checkUser) {
        console.log("Such user already has been registered");
        return;
    }

    if (req.body.password !== req.body.confirmPassword) {
        console.log("Passwords must be the same");
        return;
    }

    const hashedPassword = await hashPassword(req.body.password);

    const newUser = {
        id: uuid(),
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    }

    const userResponse = {
        username: newUser.username,
        email: newUser.email
    };

    //console.log(userResponse);
    //console.log("DANE DO ZAPISU W PLIKU BAZY DANYCH", newUser);
    //console.log(`New user saved with ID ${newUser.id}`);

    await writeData([...users, newUser]);
    res.status(201).json({userResponse, message: `USER SAVED WITH ID: ${newUser.id}`});
};