import express from "express";
import _ from 'lodash'; 
import { User, schema } from "../models/user.js";
import bodyParser from "body-parser";
import {auth} from '../middleware/auth.js';


const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
//Get all users, in case its needed
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    return res.status(400).send(error);
  }
});

//Get user by its ID

router.get("/me",auth, async (req:any, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user !== null) {
      res.json(user);
    } else {
      return res.status(404).send("User with given ID does not exists");
    }
  } catch (error) {
    return res
      .status(400)
      .send(
        "Could not get the user with given ID because an error occured" + error
      );
  }
});
//Modify user

router.put("/me",auth, async (req:any, res) => {
    let user = await User.findById(req.user._id);
  try {
    const result = schema.validate(req.body);
    if (result.error) {
      return res.status(400).send(
        "Data is not valid. Please enter valid data and try again."
      );
    }
    const user = await User.updateOne(req.body);
    res.json(user);
  } catch (error) {
    return res.status(400).send("Error whyile trying to modify user."+ error);
  }
});

//Delete user

router.delete("/me", auth, async (req:any, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.user._id);
    res.json(deleteUser);
  } catch (error) {
    return res.status(400).send("Error whyile trying to modify user."+ error);
  }
});

export default router;
