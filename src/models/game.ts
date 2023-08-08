import mongoose, {ObjectId, Schema, model, set} from 'mongoose';
import Joi from 'joi';

interface Move{
    row: number,
    col: number,
    player: ObjectId,
    currentPlayer: string
}

interface IGame{
    //Is first player in the game
    playerX:{
        playerID: ObjectId,
        name: string,
    },
    //Secon player or Ai depending on choosen game mood.
    playerO:{
        playerID: ObjectId,
        name: string,
    },
    status: string,
    board: string[][],
    moves: Move[],
    currentPlayer: string
}

const gameSchema = new Schema<IGame>({
    playerX: {
        playerID: {type: Schema.Types.ObjectId, ref:'User'},
        name: {
            type: String,
            default: 'X',
            enum: {
                values:['X']
            }
        }
    },
    playerO:{
        playerID: {type: Schema.Types.ObjectId, ref:'User'},
        name: {
            type: String,
            default: 'O',
            enum: {
                values:['O']
            }
        }
    },
    status:{
        type: String,
        enum:{
            values:['in progress','Player X won', 'Player O won', 'Draw']
        }
    },
    board: {type:[[String]], required: true},
    moves: [{ player: Schema.Types.ObjectId, row: Number, col: Number }],
    currentPlayer: {type: String, required: true, default: "X",
    enum: {
        values:['X', 'O']
    }}
})

export const Game = model<IGame>('Game', gameSchema);

export const gameschema = Joi.object({
    playerX: Joi.object({
      playerID: Joi.string().required(),
      name: Joi.string().required()  
    }),
    playerO: Joi.object({
        name: Joi.string().required()  
      }),
    status: Joi.string().required()
})

