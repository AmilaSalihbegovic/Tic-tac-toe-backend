import express from "express";
import _ from 'lodash'; 
import { User, schema } from "../models/user.js";
import bodyParser from "body-parser";
import {auth} from '../middleware/auth.js';
import { deleteUser, getAllUsers, getUserByID, modifyUser } from "../controllers/userController.js";


const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
//Get all users, in case its needed
router.get("/", getAllUsers);
//Get user by its ID
router.get("/me",auth, getUserByID);
//Modify user
router.put("/me",auth, modifyUser);
//Delete user
router.delete("/me", auth, deleteUser);

export default router;
