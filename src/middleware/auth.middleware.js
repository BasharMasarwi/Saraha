import jwt from "jsonwebtoken";
import userModel from "../../db/model/User.model.js";

const auth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization.startsWith(process.env.BEARERKEY)) {
    return res.json("invalid authorization");
  }
  const token = authorization.split(process.env.BEARERKEY)[1];
  const decoded = await jwt.verify(token, process.env.LOGINSIGN);
  const authUser = await userModel.findById(decoded.id).select('userName');
  req.user=authUser;
  next();
};
export default auth;
