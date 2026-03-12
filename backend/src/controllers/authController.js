const authService = require("../services/authService");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const loginUser = async (req, res) => {
  try {
    const data = await authService.loginUser(
      req.body.email,
      req.body.password
    );

    return successResponse(res, "Login successful", data);
  } catch (error) {
    return errorResponse(res, error.message, 401);
  }
};

const registerUser = async (req, res) => {
  try {
    const data = await authService.registerUser(req.body);

    return successResponse(res, "User registered successfully", data, 201);
  } catch (error) {
    console.error(error);
    return errorResponse(res, error.message, 400);
  }
};

const getProfile = async (req, res) => {
  try {
    const data = await authService.getProfile(req.user._id);

    return successResponse(res, "Profile retrieved successfully", data);
  } catch (error) {
    return errorResponse(res, error.message, 404);
  }
};

const setPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const data = await authService.setPassword(token, password);
    return successResponse(res, data.message);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
  loginUser,
  registerUser,
  getProfile,
  setPassword
};