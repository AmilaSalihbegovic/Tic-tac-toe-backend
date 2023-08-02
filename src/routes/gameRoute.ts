import express from "express";
import {Game, gameschema} from '../models/game.js';
import bodyParser from 'body-parser';

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

//Get all games
router.get('/', async(req, res)=>{
    try{
        const games =await Game.find();
        res.json(games);
    }catch(error){
        return console.log('Error while getting the data', error);
    }
});

//get game by id

router.get('/:id',async (req, res) => {
    try{
        const game =await Game.findById(req.params.id);
        res.json(game);
    }catch(error){
        console.log('Error trying to get game with given id', error);
    }
})

//post new game

router.post('/', async(req,res)=>{
    try{
        const newGame = new Game(req.body);
        newGame.save().then((g)=>res.json(g));
    }catch(error){
        return console.log('Error while trying to add new game', error);
    }
})

//change game

router.put('/:id', async(req, res)=>{
    try{
        const game =await Game.findByIdAndUpdate(req.params.id, req.body);
        res.json(game);
    }catch(error){
        return console.log('Error while trying to change.', error);
    }
})

//delete game

router.delete('/:id', async(req,res)=>{
    try{
        const game =await Game.findByIdAndDelete(req.params.id);
        res.json(game);
    }catch(error){
        return console.log('Error while trying to delete game.', error);
    }
})

//need to add endpoint for adding move to the created game and endpoint for joining game.
export default router;