const userRepo = require("../repositories/userRepository");
const generateToken = require("../utils/generateToken");

const loginUser = async (email, password) => {
  const user = await userRepo.findUserByEmail(email);

  if (!user.isActive) {
    throw new Error("Account not activated yet");
  }

  if (!user || !(await user.matchPassword(password))) {
    throw new Error("Invalid email or password");
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  };
};

const registerUser = async (data) => {
  const { name, email, password, role, district } = data;

  const userExists = await userRepo.findUserByEmail(email);

  if (userExists) {
    throw new Error("User already exists");
  }

  const user = await userRepo.createUser({
    name,
    email,
    password,
    role: role || "Contributor",
    district,
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  };
};

const getProfile = async (userId) => {
  const user = await userRepo.findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    points: user.points,
  };
};

const setPassword = async (token, password) => {
  const user = await userRepo.findUserByInviteToken(token);

  if (!user || user.inviteTokenExpire < Date.now()) {
    throw new Error("Invalid or expired invite link");
  }

  user.password = password;
  user.isActive = true;
  user.inviteToken = undefined;
  user.inviteTokenExpire = undefined;

  await user.save();
  return { message: "Password set successfully" };
};

module.exports = {
  loginUser,
  registerUser,
  getProfile,
  setPassword
};