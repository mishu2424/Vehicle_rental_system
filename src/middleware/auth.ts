import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../config/db";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token = req.headers.authorization;
      if (!token) {
        return res.status(500).json({ message: "You are not allowed!!" });
      }
      if (token.length) {
        token = token.split(" ")[1];
      }
      //   console.log(token);

      const decoded = jwt.verify(
        token as string,
        config.jwt_secret as string
      ) as JwtPayload;

      // if token exists; but user does not exist anymore in the db.
      const user = await pool.query(
        `
        SELECT * FROM users WHERE email=$1 
        `,
        [decoded?.email]
      );

      if (user.rows.length === 0) {
        throw new Error("User not found!!!");
      }

      req.user = decoded;

      // console.log(roles,decoded);

      if (roles.length && !roles.includes(decoded.role as string)) {
        return res.status(401).json({
          error: "unauthorized!!!",
        });
      }

      next();
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
};

export default auth;
