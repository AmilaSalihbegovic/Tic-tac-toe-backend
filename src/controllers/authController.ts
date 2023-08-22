import express from "express";
import _ from "lodash";
import { User, schema } from "../models/user.js";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import Joi from "joi";

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/signin", async (req, res) => {
  try {
    const result = schema.validate(req.body);
    if (result.error) {
      return res
        .status(400)
        .send("Invalid username or password." + result.error);
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send("User already exists.");
    }
    user = new User(_.pick(req.body, ["name", "email", "password"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    const savedUser = await user.save();
    const token = user.generateAuthToken();
    res
      .header("X-auth-token", token)
      .send(_.pick(savedUser, ["_id", "name", "email"]));
  } catch (error) {
    return res
      .status(400)
      .send("Could not signin the user because an error occured" + error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const result = loginschema.validate(req.body);
    if (result.error) {
      return res.status(400).send("Invalid username or password.");
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      const compare = await bcrypt.compare(req.body.password, user.password);
      if (compare) {
        const token = user.generateAuthToken();

        return res.send(token);
      }
      return res.status(400).send("Invalid username or password.");
    }
  } catch (error) {
    return res
      .status(400)
      .send("Could not login the user because an error occured" + error);
  }
});

const loginschema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "rs"] },
  }),
  password: Joi.string()
    .min(5)
    .max(255)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

export default router;
