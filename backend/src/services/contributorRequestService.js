const crypto = require("crypto");

const requestRepo = require("../repositories/contributorRequestRepository");
const userRepo = require("../repositories/userRepository");
const sendEmail = require("../utils/sendEmail");

const createRequest = async (data) => {

  const existing = await userRepo.findUserByEmail(data.email);

  if (existing) {
    throw new Error("User already exists");
  }

  return await requestRepo.createRequest(data);
};

const getRequests = async () => {
  return await requestRepo.getPendingRequests();
};

const approveRequest = async (id) => {

  const request = await requestRepo.findRequestById(id);

  if (!request) {
    throw new Error("Request not found");
  }

  const inviteToken = crypto.randomBytes(32).toString("hex");

  const user = await userRepo.createUser({
    name: request.name,
    email: request.email,
    role: "Contributor",
    district: request.district,
    inviteToken,
    inviteTokenExpire: Date.now() + 24 * 60 * 60 * 1000
  });

  await requestRepo.updateStatus(id, "approved");

  const inviteLink = `http://localhost:5173/set-password?token=${inviteToken}`;

  await sendEmail(
    request.email,
    "Contributor Access Approved",
    `
      <h2>Your contributor access has been approved</h2>
      <p>Click the link below to set your password</p>
      <a href="${inviteLink}">${inviteLink}</a>
    `
  );

  return {
    user
  };
};

module.exports = {
  createRequest,
  getRequests,
  approveRequest
};