import { Schema, model } from "mongoose";
import Joi from "joi";
import jwt from 'jsonwebtoken';

interface IUser {
  name: string;
  email: string;
  password: string;
  generateAuthToken(): string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, minlength:5, maxlength: 255, unique:true },
  password: { type: String, required: true, minlength:5, maxlength: 1024 },
});

userSchema.methods.generateAuthToken = function(){
  const token =  jwt.sign({_id: this._id}, process.env.JWT_SECRET || "", {
    expiresIn: "1h",
  });
  return token
}

export const schema = Joi.object({
  name: Joi.string().min(3).max(25).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "rs"] },
  }),
  password: Joi.string().min(5).max(255).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

export const User = model<IUser>("User", userSchema);
