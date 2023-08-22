import { User, schema } from "../models/user.js";

export const getAllUsers = async (req: any, res: any) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    return res.status(400).send(error);
  }
};

export const getUserByID = async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (user !== null) {
      return res.json(user);
    }
    return res.status(404).send("User with given ID does not exists");
  } catch (error) {
    return res
      .status(400)
      .send(
        "Could not get the user with given ID because an error occured" + error
      );
  }
};
export const modifyUser = async (req: any, res: any) => {
  let user = await User.findById(req.user._id);
  if(!user){
    return res.status(400).send("User doesn't exists.");
  }
  try {
    const result = schema.validate(req.body);
    if (result.error) {
      return res
        .status(400)
        .send("Data is not valid. Please enter valid data and try again.");
    }
    const user = await User.updateOne(req.body);
    res.json(user);
  } catch (error) {
    return res.status(400).send("Error whyile trying to modify user." + error);
  }
};
export const deleteUser = async (req: any, res: any) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.user._id);
    res.json(deleteUser);
  } catch (error) {
    return res.status(400).send("Error whyile trying to modify user." + error);
  }
};
