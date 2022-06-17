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

const { authenticate, authenticateAdmin } = require("../middlewires/jwt");

import { QueryResult } from "pg";
import { Admin } from "../models/Admin";
import { Department } from "../models/Department";

router.post(
  "/create",
  authenticateAdmin,
  async (req: Request, res: Response) => {
    try {
      var reqAdmin: Admin = req.body.admin;

      var department: Department = req.body;
      var query_text =
        "INSERT INTO departments (name)\
        VALUES($1) RETURNING *;";

      var values: string[] = [department.name];

      var result: QueryResult<any> = await runQuery(query_text, values);
      var departments: Department[] = result.rows;

      console.log(departments);
      return res.status(200).json(departments);
    } catch (error: any) {
      if (error.constraint) {
        res.status(500).json(error.constraint);
      }
      return res.status(500).json(error);
    }
  }
);

module.exports = router;
