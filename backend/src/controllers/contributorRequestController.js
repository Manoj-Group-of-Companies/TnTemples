const service = require("../services/contributorRequestService");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const createRequest = async (req, res) => {
  try {

    const data = await service.createRequest(req.body);

    return successResponse(res, "Request submitted", data, 201);

  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getRequests = async (req, res) => {
  try {

    const data = await service.getRequests();

    return successResponse(res, "Requests fetched", data);

  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const approveRequest = async (req, res) => {
  try {

    const data = await service.approveRequest(req.params.id);

    return successResponse(res, "Contributor approved", data);

  } catch (error) {
    return errorResponse(res, error.message);
  }
};

module.exports = {
  createRequest,
  getRequests,
  approveRequest
};