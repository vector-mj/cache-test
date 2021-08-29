import multer from "multer";
import { Request } from "express";
import { body, check } from "express-validator";

export const upload = multer({
  storage: multer.diskStorage({
    destination: (req: Request, file, cb: Function) => {
      cb(null, __dirname + "/../Public/image");
    },
    filename: (req, file: Express.Multer.File, cb: Function) => {
      let name = `${Date.now()}-${file.originalname}`;
      cb(null, name);
    },
  }),
  fileFilter: (req, file, cb) => {
    return file.mimetype !== "image/png" ? cb(null, false) : cb(null, true);
  },
});

export const validator = [
  body("username")
    .isEmail()
    .withMessage("We need your email for create account"),
  body("password")
    .isLength({ min: 4, max: 20 })
    .withMessage("password must be between 4,20"),
];

export const loginValidator = [
  check("username").notEmpty().withMessage("we need a username for login"),
  check("password").notEmpty().withMessage("we need your password for login"),
];
