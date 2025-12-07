import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
const signUpUsers = async (payload) => {
    const { name, email, password, phone, role } = payload;
    const hashedPass = await bcrypt.hash(password, 10);
    const result = await pool.query(`
        INSERT INTO users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5) RETURNING name,email,phone,role
        `, [name, email, hashedPass, phone, role]);
    return result;
};
const signInUsers = async (user_email, password) => {
    const result = await pool.query(`
        SELECT * FROM users WHERE email=$1
        `, [user_email]);
    if (result.rows.length === 0) {
        return null;
    }
    let user = result.rows[0];
    const match = await bcrypt.compare(password, user?.password);
    if (!match) {
        return null;
    }
    const { name, email, phone, role } = user;
    user = {
        name,
        email,
        phone,
        role
    };
    const token = jwt.sign({ name: user?.name, role: user?.role, email: user?.email }, config.jwt_secret, {
        expiresIn: "7d",
    });
    return { token, user };
};
export const authServices = {
    signUpUsers,
    signInUsers
};
