import express from 'express';
import {User, schema} from '../models/user.js';
import bodyParser from 'body-parser';

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
//Get all users, in case its needed 
router.get('/', async (req, res)=> {
    try{
        const users = await User.find();
        res.json(users);
    }catch(error){
        return console.log('Error while trying to get users',error);
    } 
})

//Get user by its ID

router.get('/:id', async(req, res)=>{
    try{
        const user = await User.findById(req.params.id);
    if(user !== null){
        res.json(user);
    }else{
        return console.log('User with given ID does not exists');
    }
    }catch(error){
        return console.log('Error has occured whtile trying to fetch the data.', error);
    }
})

//Add new user, will be modify once authentication and autorization is done.

router.post('/', async(req,res)=>{
    try{
        console.log(req.body);

        const result = schema.validate(req.body);
        if(result.error){
            return console.log('Data is not valid. Please enter valid data and try again.')
        }
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.json(savedUser);
    }catch(error){
        return console.log('Error whyile trying to add user.', error);
    }
})

//Modify user

router.put('/:id', async(req,res)=>{
    try{
        const result = schema.validate(req.body);
        if(result.error){
            return console.log('Data is not valid. Please enter valid data and try again.')
        }
        const user =await User.findByIdAndUpdate(req.params.id, req.body);
        res.json(user);
    }catch(error){
        return console.log('Error whyile trying to modify user.', error);
    }
})

//Delete user

router.delete('/:id', async(req, res)=>{
    try{
        const deleteUser =await User.findByIdAndDelete(req.params.id);
        res.json(deleteUser);
    }catch(error){
        return console.log('Error occured whyile trying to delete user.', error);
    }
})

export default router;