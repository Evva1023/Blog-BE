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
    return isPasswordCorrect;
};

export const login = async (req, res) => {
    const users = await readData();

    const userLoginData = req.body;
    console.log(userLoginData);

    const checkUser = await users.find(user => user.username === userLoginData.username);

    if (!checkUser) {
        console.log("No such user");
        return res.status(409).json({message: "User not found"});
    }

    comparePassword(userLoginData.password, checkUser.password);
    
    if (!comparePassword) {
        return res.status(400).json({message: "Password not correct"});
    }
    
    const token = jwt.sign({id: checkUser.id}, "SECRET_KEY_HERE");

    res.cookie("access_token", token, {httpOnly: true}).status(200).json({username: checkUser.username});
};


export const logout = (req, res) => {
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true
    }).status(200).json({message: "User logged out"});
};



export const register = async (req, res) => {
    const users = await readData();
    //console.log("DANE Z PLIKU BAZY DANYCH", users);

    const newUserData = req.body;
    //console.log("DANE NOWEGO USERA Z FORMULARZA",newUserData);
    
    const checkUser = await users.find(user => user.username === newUserData.username || user.email === newUserData.email);
    //console.log(checkUser.username, checkUser.email);
    if (checkUser) {
        console.log("Such user already has been registered");
        return res.status(409).json({message: "User already exists"});
    }

    if (newUserData.password !== newUserData.confirmPassword) {
        console.log("Passwords must be the same");
        return res.status(409).json({message: "Passwords must be exactly the same"});
    }

    const hashedPassword = await hashPassword(newUserData.password);

    const newUser = {
        id: uuid(),
        username: newUserData.username,
        email: newUserData.email,
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