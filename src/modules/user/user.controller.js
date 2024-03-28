import userModel from "../../../db/model/User.model.js";

export const getUsers = async (req, res) => {
   const user = await userModel.findById(req.user.id);
   return res.json(user);
}