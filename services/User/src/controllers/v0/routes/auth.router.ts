import { Router, Request, Response } from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { NextFunction } from "connect";
import * as EmailValidator from "email-validator";
import { User } from "../models/User";
import { config } from "../../../config/config";

const router: Router = Router();

async function generatePassword(plainTextPassword: string): Promise<string> {
  return bcrypt.hash(plainTextPassword, 10);
}

async function comparePasswords(plainTextPassword: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainTextPassword, hash);
}

function generateUserJWT(user: User): string {
  return jwt.sign({ email: user.email }, config.jwt.secret, {
    expiresIn: "60 days",
  });
}

/**
 * Middleware to validate if a valid user JWT auth token was sent in
 * request headers.
 * 
 * @param req Node Express Request object.
 * @param res Node Express Response object.
 * @param next Middleware next function.
 */
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req?.headers?.authorization) {
    req.status = 401;
    req.auth = false;
    req.message = "No authorization headers.";
    return next();
  }
  const token_bearer = req.headers.authorization.split(" ");
  if (token_bearer.length != 2) {
    req.status = 401;
    req.auth = false;
    req.message = "Malformed token.";
    return next();
  }
  const token = token_bearer[1];

  return jwt.verify(token, config.jwt.secret, (err, decoded) => {
    if (err) {
      req.status = 500;
      req.auth = false;
      req.message = "Failed to authenticate.";
      return next();
    }
    req.status = 200;
    req.auth = true;
    req.message = "Authenticated.";

    return next();
  });
}

router.get("/verification", requireAuth, async (req: Request, res: Response) => {
  return res.status(req.status).json({ auth: req.auth, message: req.message });
});

router.post("/login", async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !EmailValidator.validate(email)) {
    return res.status(400).send({
      auth: false,
      error: { message: "Email is required or malformed" },
    });
  }
  if (!password) {
    return res.status(400).send({ auth: false, error: { message: "Password is required" } });
  }
  const user = await User.findByPk(email);
  if (!user) {
    return res.status(401).send({ auth: false, error: { message: "Unauthorized" } });
  }
  const authValid = await comparePasswords(password, user.password_hash);
  if (!authValid) {
    return res.status(401).send({ auth: false, error: { message: "Unauthorized" } });
  }
  const jwt = generateUserJWT(user);

  return res.status(200).send({ auth: true, token: jwt, user: user.short() });
});

router.post("/", async (req: Request, res: Response) => {
  const email = req.body.email;
  const plainTextPassword = req.body.password;
  if (!email || !EmailValidator.validate(email)) {
    return res.status(400).send({
      auth: false,
      error: { message: "Email is missing or malformed" },
    });
  }
  if (!plainTextPassword) {
    return res.status(400).send({ auth: false, error: { message: "Password is required." } });
  }
  const user = await User.findByPk(email);
  if (user) {
    return res
      .status(422)
      .send({ auth: false, error: { message: "User may already exists." } });
  }
  const password_hash = await generatePassword(plainTextPassword);
  const newUser = new User({
    email: email,
    password_hash: password_hash,
  });
  let savedUser;
  try {
    savedUser = await newUser.save();
  } catch (e) {
    throw e;
  }
  const jwt = generateUserJWT(savedUser);

  return res.status(201).send({ token: jwt, user: savedUser.short() });
});

router.get("/", async (req: Request, res: Response) => {
  return res.send("auth");
});

export const AuthRouter: Router = router;
