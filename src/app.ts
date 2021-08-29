import express, { Express, Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import cookieSession from "cookie-session";
import errorHandler from "./Middlewares/Error";
const port = process.env.SERVERPORT || 5000;
import { upload, validator, loginValidator } from "./Middlewares/Upload";
import { mongoose, clearHash } from "./Middlewares/cache";
import cookieParser from "cookie-parser";
import moment from "jalali-moment";
import { Password } from "./Middlewares/Hashing";
import jwt from "jsonwebtoken";
/// User Model
import { User } from "./Models/userModel";

const app = express();
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/Public"));
app.set("views", `${__dirname}/Views`);
app.use(cookieParser("secret"));

app.get("/signin", (req: Request, res: Response) => {
  res.render("signin", { data: "Hi" });
});
app.get("/", (req: Request, res: Response) => {
  res.render("index");
});

app.get("/login", (req: Request, res: Response) => {
  // console.log(new Date(Date.now()+(60000*2)).toISOString())
  let m = moment();
  console.log(m.locale("fa").format("YYYY/M/D - hh:mm:ss"));
  res.cookie("jwt", "asdf4234", { httpOnly: true, secure: true });
  res.send("man");
});
app.post("/loginUser", loginValidator, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      Status: "Error",
      Errors: errors.array(),
    });
  }
  let user;
  try {
    user = await User.find({ username: req.body.username }).cache({key:"users"});
    if (!user) {
      throw new Error("This username not found");
    }
    let passwordCompare = await Password.compare(
      user.password,
      req.body.password
    );

    if (!passwordCompare) {
      throw new Error("Password is incurrect");
    }
    // Create cookie and send
    res.cookie(
      "jwt",
      jwt.sign({ username: user.username }, "secret", { expiresIn: "1h" }),
      { secure: true, httpOnly: true }
    );
  } catch (err) {
    return res.send(err);
  }
  res.send("Dashboard");
});
app.get("/dashboard", (req: Request, res: Response) => {
  res.send(req.cookies);
});
app.post(
  "/form",
  upload.single("avatar"),
  validator,
  async (req: Request, res: Response) => {
    let errors: any = validationResult(req);

    if (!errors.isEmpty() || !req.file?.filename) {
      return res.status(400).send({
        Status: "Error",
        msg: errors.isEmpty() ? "file is require" : errors.array(),
      });
    }

    // Create User
    try {
      let pass = await Password.toHash(req.body.password);
      const user = await User.create({
        username: req.body.username,
        password: pass,
        avatar: req.file.filename,
      });
    } catch (err) {
      return res.status(400).send({
        Status: "Error",
        msg: "user creation Failed",
      });
    }
    res.redirect("/");
  }
);

app.get("");

mongoose
  .connect("mongodb://mongoDB:27017/ishia")
  .then((con) => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
