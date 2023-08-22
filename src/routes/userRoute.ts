import express from "express";
import _ from 'lodash'; 
import { User, schema } from "../models/user.js";
import bodyParser from "body-parser";
import {auth} from '../middleware/auth.js';
import { deleteUser, getAllUsers, getUserByID, modifyUser } from "../controllers/userController.js";


const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.get("/", getAllUsers);
router.get("/me",auth, getUserByID);
router.put("/me",auth, modifyUser);
router.delete("/me", auth, deleteUser);

export default router;
