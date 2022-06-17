import express, {
  Application,
  Request,
  Response,
  NextFunction,
  Router,
} from "express";

import jwt, {
  Secret,
  SignCallback,
  VerifyCallback,
  VerifyErrors,
} from "jsonwebtoken";
import { Admin } from "../models/Admin";
import { User } from "../models/User";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerHeader = req.headers.authorization;

  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    var seccretKey: Secret = process.env.SECRET_KEY!;

    try {
      const user: User = await verifyToken(token, seccretKey);
      req.body.user = user;
      next();
    } catch (error) {
      res.status(403).json("invalid token");
    }
  } else {
    res.status(403).json("cannot authenticate");
  }
};

const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerHeader = req.headers.authorization;

  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    var seccretKey: Secret = process.env.SECRET_KEY_ADMIN!;

    try {
      const admin: Admin = await verifyToken(token, seccretKey);
      req.body.admin = admin;
      next();
    } catch (error) {
      res.status(403).json("invalid token");
    }
  } else {
    res.status(403).json("cannot authenticate");
  }
};

const verifyToken = async (token: string, secretKey: Secret): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    jwt.verify(token, secretKey, <VerifyCallback>(
      function (err: VerifyErrors, decoded: any) {
        if (err) {
          reject(err);
        }

        resolve(decoded);
      }
    ));
  });
};

module.exports = { authenticate, authenticateAdmin };
