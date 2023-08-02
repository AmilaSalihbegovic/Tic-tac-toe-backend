import { Schema, model } from "mongoose";
import Joi from "joi";

interface IUser {
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export const schema = Joi.object({
  name: Joi.string().min(3).max(25).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "rs"] },
  }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

export const User = model<IUser>("User", userSchema);
