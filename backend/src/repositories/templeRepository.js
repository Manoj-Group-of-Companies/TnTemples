const Temple = require("../models/Temple");

const findTemples = async (query, limit, page) => {
  return await Temple.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate("deity district festivals contributor");
};

const countTemples = async (query) => {
  return await Temple.countDocuments(query);
};

const findTempleBySlug = async (slug) => {
  return await Temple.findOne({ slug, status: "approved" })
    .populate("deity district festivals contributor");
};

const createTemple = async (data) => {
  return await Temple.create(data);
};

const updateTempleStatus = async (id, updateData) => {

  return await Temple.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  );

};

const findNearbyTemples = async (lat, lng, radius) => {

  return await Temple.find({
    status: "approved",
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        $maxDistance: parseInt(radius)
      }
    }
  });
};

const findPendingTemples = async () => {

  return await Temple.find({ status: "pending" })
    .populate("deity district contributor")
    .sort({ createdAt: -1 });

};

const findTempleByName = async (name) => {
  return await Temple.findOne({
    name: { $regex: `^${name}$`, $options: "i" }
  });
};

const findTemplesByContributor = async (userId) => {

  return await Temple.find({ contributor: userId })
    .populate("deity district")
    .sort({ createdAt: -1 });

};

module.exports = {
  findTemples,
  countTemples,
  findTempleBySlug,
  createTemple,
  updateTempleStatus,
  findNearbyTemples,
  findPendingTemples,
  findTempleByName,
  findTemplesByContributor
};