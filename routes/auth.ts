import { LoginReq } from "./../models/LoginReq";
import { AuthRes } from "./../models/AuthRes";
import { NewUserReq } from "./../models/NewUserReq";
import { User } from "./../models/User";

import { compare, genSalt, hash } from "bcrypt";

const { runQuery } = require("./../db");

import express, {
  Application,
  Request,
  Response,
  NextFunction,
  Router,
} from "express";
const router: Router = express.Router();

var multer = require("multer");
const upload = multer({ dest: "uploads/" });

// import { db, runQuery } from "../db/db.js";

import jwt, { Secret, SignCallback } from "jsonwebtoken";
import { QueryResult } from "pg";
import { LoginReqAdmin } from "../models/auth/LoginReqAdmin";
import { Admin } from "../models/Admin";
import { AdminAuthRes } from "../models/auth/AdminAuthRes";

router.post("/register", async (req: Request, res: Response) => {
  try {
    var newUserReq: NewUserReq = req.body;

    const salt: string = await genSalt(10);
    const hashedPassword: string = await hash(newUserReq.password, salt);

    var query_text: string =
      "INSERT INTO users (first_name, last_name,email,password)\
      VALUES($1,$2,$3,$4) RETURNING *;";

    var values: string[] = [
      newUserReq.first_name,
      newUserReq.last_name,
      newUserReq.email,
      hashedPassword,
    ];

    var result: QueryResult<any> = await runQuery(query_text, values);
    var rows: User[] = result.rows;
    var newUser: User = rows[0];

    console.log("====================================");
    console.log(newUser);
    console.log("====================================");

    var secretKey: string = process.env.SECRET_KEY!;

    var accessToken: string = jwt.sign(newUser, secretKey);

    const authResponse: AuthRes = {
      user_id: newUser.user_id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      token: accessToken,
    };

    return res.status(200).json(authResponse);
  } catch (error: any) {
    if (error.constraint) {
      res.status(500).json(error.constraint);
    }
    return res.status(500).json(error);
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    var loginReq: LoginReq = req.body;

    var query_text: string =
      "select *\
      from users \
      where email = $1;";

    var values: any[] = [loginReq.email];

    var result: QueryResult<any> = await runQuery(query_text, values);

    if (result.rowCount != 1) {
      return res.status(404).json("account does not exist");
    }

    var rows: User[] = result.rows;
    var user: User = rows[0];

    const validPassword: boolean = await compare(
      loginReq.password,
      user.password!
    );

    if (!validPassword) {
      return res.status(403).json("wrong password");
    }

    var seccretKey: Secret = process.env.SECRET_KEY!;

    jwt.sign(user, seccretKey, <SignCallback>(
      function (err: Error, accessToken: string) {
        const authResponse: AuthRes = {
          user_id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          token: accessToken,
        };

        res.status(201).json(authResponse);
      }
    ));
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/admin-login", async (req: Request, res: Response) => {
  try {
    var loginReq: LoginReqAdmin = req.body;

    var query_text: string =
      "select *\
      from admins \
      where username = $1;";

    var values: any[] = [loginReq.username];

    var result: QueryResult<any> = await runQuery(query_text, values);

    if (result.rowCount != 1) {
      return res.status(404).json({ message: "username" });
    }

    var rows: Admin[] = result.rows;
    var admin: Admin = rows[0];

    const validPassword: boolean = await compare(
      loginReq.password,
      admin.password!
    );

    if (!validPassword) {
      return res.status(403).json({ message: "password" });
    }

    var seccretKey: Secret = process.env.SECRET_KEY_ADMIN!;

    jwt.sign(admin, seccretKey, <SignCallback>(
      function (err: Error, accessToken: string) {
        const authResponse: AdminAuthRes = {
          admin_id: admin.admin_id,
          username: admin.username,
          token: accessToken,
        };

        res.status(201).json(authResponse);
      }
    ));
  } catch (error) {
    res.status(500).json(error);
  }
});

// router.post("/create-admin", async (req: Request, res: Response) => {
//   try {
//     const username: string = "admin";
//     const password: string = "admin";
//     const salt: string = await genSalt(10);
//     const hashedPassword: string = await hash(password, salt);

//     var query_text =
//       "INSERT INTO admins (username,password)\
//       VALUES($1,$2) RETURNING *;";

//     var values = [username, hashedPassword];

//     var result: QueryResult<any> = await runQuery(query_text, values);
//     var rows: any[] = result.rows;
//     var newAdmin: any = rows[0];

//     console.log("====================================");
//     console.log(newAdmin);
//     console.log("====================================");
//     res.status(201).json(newAdmin);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });
// router.post("/admin/login", async (req, res) => {
//   try {
//     var query_text = "select *\
//       from admins \
//       where username = ?;";

//     var values = [req.body.username];

//     var admin = await runQuery(query_text, values);

//     if (admin.length != 1) {
//       return res.status(404).json("Admin Not found");
//     }

//     admin = admin[0];

//     const validPassword = await bcrypt.compare(
//       req.body.password,
//       admin.password
//     );

//     if (!validPassword) {
//       return res.status(403).json({ error: "wrong password" });
//     }

//     delete admin["password"];
//     jwt.sign({ admin: admin }, process.env.SECRET_KEY, function (err, token) {
//       admin.token = token;
//       res.status(201).json(admin);
//     });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });
module.exports = router;
