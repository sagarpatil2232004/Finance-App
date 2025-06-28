"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogin = exports.userRegister = void 0;
const userSchema_1 = __importDefault(require("../model/userSchema"));
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, password } = req.body;
    if (!user_id || !password) {
        res.status(400).json({ message: "User ID and password are required" });
        return;
    }
    try {
        // Check if the user already exists
        const existingUser = yield userSchema_1.default.findOne({ user_id });
        if (existingUser) {
            res.status(409).json({ message: "User already exists" });
            return;
        }
        // Hash the password
        const hashedPassword = yield (0, bcrypt_1.hash)(password, 10); // 10 is salt rounds
        // Create new user
        const newUser = new userSchema_1.default({
            user_id,
            password: hashedPassword,
        });
        yield newUser.save();
        const token = jsonwebtoken_1.default.sign({ user_id }, process.env.JWT_SECRET);
        res.status(201).json({ token, user_id });
    }
    catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.userRegister = userRegister;
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, password } = req.body;
    if (!user_id || !password) {
        res.status(400).json({ message: "User ID and password are required" });
        return;
    }
    try {
        const user = yield userSchema_1.default.findOne({ user_id });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const isMatch = yield (0, bcrypt_1.compare)(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ user_id }, process.env.JWT_SECRET);
        res.status(200).json({ token, user_id });
    }
    catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.userLogin = userLogin;
