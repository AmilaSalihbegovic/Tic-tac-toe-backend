import mongoose, {ObjectId, Schema, model, set} from 'mongoose';
import Joi from 'joi';

interface IGame{
    //Is first player in the game
    playerX:{
        playerID: ObjectId,
        name: string,
    },
    //Secon player or Ai depending on choosen game mood.
    playerO:{
        playerID: ObjectId | 0,
        name: string,
    },
    status: string,
    board: [[string]],
    moves: [{
        row: number,
        column: number,
        player: string
    }]
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
        playerID: {type: Schema.Types.Mixed, ref:'User'},
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
    board:{type:[[String]], required:true},
    moves:[{
        row: {type: Number, required: true},
        column:{type: Number, required: true},
        player: {type: String, enum:{values:['X','O']}}
    }],
})

export const Game = model<IGame>('Game', gameSchema);

export const gameschema = Joi.object({
    playerX: Joi.object({
      playerID: Joi.string().required(),
      name: Joi.string().required()  
    }),
    playerO: Joi.object({
        playerID: Joi.required(),
        name: Joi.string().required()  
      }),
    status: Joi.string().required()
})

