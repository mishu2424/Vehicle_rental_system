import { authServices } from "./auth.services";
const signUpUsers = async (req, res) => {
    try {
        const result = await authServices.signUpUsers(req?.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result.rows[0],
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || "Something went wrong while signing up",
        });
    }
};
const signInUsers = async (req, res) => {
    const { email, password } = req?.body;
    try {
        const result = await authServices.signInUsers(email, password);
        res.status(200).json({
            success: true,
            message: "login successful",
            data: result,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || "Something went wrong while signing in",
        });
    }
};
export const authControllers = {
    signUpUsers,
    signInUsers
};
