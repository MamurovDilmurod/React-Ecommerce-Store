import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/useModel.js";


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, message: "Login successful", token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong" })
    }
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // checking user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }
        // validation strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be 8 characters long" })
        }
        // hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // creating user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });
        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, message: "User created successfully", token })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong" })

    }
}
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, message: "Login successful😍", token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong" })
    }
}
export { loginUser, registerUser, adminLogin };