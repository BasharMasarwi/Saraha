import userModel from "../../../db/model/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import SendEmail from "../../utils/SendEmail.js";
export const signup = async (req, res) => {
  const { userName, email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (user) {
    return res.status(409).json("user already exists");
  }
  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.SALT)
  );
  const newUser = await userModel.create({
    userName,
    email,
    password: hashedPassword,
  });
  if (!newUser) {
    return res.json({ message: "user not created" });
  }
  const token = await jwt.sign({ email }, process.env.CONFIRMEMAILTOKEN, {
    expiresIn: "1h",
  });
  const refreshToken = await jwt.sign(
    { email },
    process.env.CONFIRMEMAILTOKEN,
    { expiresIn: "2d" }
  );
  const html = `
  <h1> Welcome to Beshooo </h1>
  <h2>your email is ${email}</h2>
   <div>
   <h2>please confirm your email <a href="${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}">click here</a></h2>
    <a href ="${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${refreshToken}">Resend confirm email</a>
   </div>
  `;
  await SendEmail(email, "Beshooo", html);
  return res.status(201).json({ message: "user created", newUser });
};
export const signin = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select('userName password confirmEmail');

  if (!user) {
    return res.json({ message: "user not found" });
  }
  if (!user.confirmEmail) {
    return res.json({ message: "please confirm your email" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.json({ message: "invalid credentials" });
  }
  const token = jwt.sign({ id: user._id }, process.env.LOGINSIGN, {
    expiresIn: "1d",
  });
  return res.json({ message: "success", token });
};
export const confirmEmail = async (req, res) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.CONFIRMEMAILTOKEN);
  const user = await userModel.updateOne(
    { email: decoded.email },
    { confirmEmail: true },
    { new: true }
  );
  if (user.modifiedCount > 0) {
    return res.redirect(process.env.FEURL);
  }
  return res.json({ message: "email confirmed", user });
};
export const newConfirmEmail = async (req, res) => {
  const { refreshToken } = req.params;
  const decoded = jwt.verify(refreshToken, process.env.CONFIRMEMAILTOKEN);
  const user = await userModel.updateOne(
    { email: decoded.email },
    { confirmEmail: true },
    { new: true }
  );
  if (user.modifiedCount > 0) {
    return res.redirect(process.env.FEURL);
  }
  return res.json({ message: "email confirmed now ! you can login", user });
};
