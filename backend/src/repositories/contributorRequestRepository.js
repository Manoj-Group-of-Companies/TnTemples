const ContributorRequest = require("../models/ContributorRequest");

const createRequest = async (data) => {
  return await ContributorRequest.create(data);
};

const getPendingRequests = async () => {
  return await ContributorRequest.find({ status: "pending" });
};

const findRequestById = async (id) => {
  return await ContributorRequest.findById(id);
};

const updateStatus = async (id, status) => {
  return await ContributorRequest.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
};

module.exports = {
  createRequest,
  getPendingRequests,
  findRequestById,
  updateStatus
};