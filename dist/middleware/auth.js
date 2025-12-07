import jwt from "jsonwebtoken";
import config from "../config";
const auth = (...roles) => {
    return async (req, res, next) => {
        try {
            let token = req.headers.authorization;
            if (!token) {
                return res.status(500).json({ message: "You are not allowed!!" });
            }
            if (token.length) {
                token = token.split(" ")[1];
            }
            //   console.log(token);
            const decoded = jwt.verify(token, config.jwt_secret);
            req.user = decoded;
            // console.log(roles,decoded);
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(401).json({
                    error: "unauthorized!!!",
                });
            }
            next();
        }
        catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    };
};
export default auth;
