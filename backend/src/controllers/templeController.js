const templeService = require("../services/templeService");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const getTemples = async (req, res) => {
  try {
    const data = await templeService.getTemples(req.query);
    return successResponse(res, "Temples retrieved successfully", data);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getPendingTemples = async (req, res) => {
  try {
    const data = await templeService.getPendingTemples(req.query);
    return successResponse(res, "Pending temples retrieved successfully", data);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getTempleBySlug = async (req, res) => {
  try {
    const temple = await templeService.getTempleBySlug(req.params.slug);

    if (!temple) {
      return errorResponse(res, "Temple not found", 404);
    }

    return successResponse(res, "Temple details retrieved successfully", temple);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getMyTemples = async (req, res) => {
  try {
    const temples = await templeService.getMyTemples(req.user._id);
    return successResponse(res, "Your temples retrieved successfully", temples);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getNearbyTemples = async (req, res) => {
  try {
    const temples = await templeService.getNearbyTemples(req.query);
    return successResponse(res, "Nearby temples retrieved successfully", temples);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const createTemple = async (req, res) => {
  try {
    // Validate minimum images
    if (!req.files || req.files.length < 3) {
      return errorResponse(res, "Minimum 3 temple images are required", 400);
    }

    if (req.files.length > 10) {
      return errorResponse(res, "Maximum 10 images allowed", 400);
    }

    let location = req.body.location;

    if (location) {
      const coords = JSON.parse(location);

      location = {
        type: "Point",
        coordinates: coords
      };
    }

    const images = req.files.map(file => `/uploads/${file.filename}`);

    const temple = await templeService.createTemple({
      ...req.body,
      location,
      images
    }, req.user._id);

    return successResponse(res, "Temple created successfully", temple, 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const approveTemple = async (req, res) => {
  try {
    const temple = await templeService.approveTemple(
      req.params.id,
      req.user._id
    );

    return successResponse(res, "Temple approved successfully", temple);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const rejectTemple = async (req, res) => {
  try {
    const temple = await templeService.rejectTemple(
      req.params.id,
      req.body.reason
    );

    return successResponse(res, "Temple rejected successfully", temple);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
  getTemples,
  getPendingTemples,
  getTempleBySlug,
  getMyTemples,
  getNearbyTemples,
  createTemple,
  approveTemple,
  rejectTemple
};
