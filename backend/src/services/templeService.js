const templeRepo = require("../repositories/templeRepository");
const slugify = require("slugify");

const getTemples = async (queryParams) => {

  const { q, district, deity, limit = 10, page = 1 } = queryParams;

  const query = { status: "approved" };

  if (q) {
    query.name = { $regex: q, $options: "i" };
  }

  if (district) query.district = district;
  if (deity) query.deity = deity;

  const temples = await templeRepo.findTemples(query, limit, page);
  const count = await templeRepo.countTemples(query);

  return {
    temples,
    totalCount: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page)
  };
};

const getPendingTemples = async (queryParams) => {

  const { status = "pending", limit = 10, page = 1 } = queryParams;

  const query = {};

  if (status && status !== "all") {
    query.status = status;
  }

  const temples = await templeRepo.findTemples(query, limit, page);
  const count = await templeRepo.countTemples(query);

  return {
    temples,
    totalCount: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page)
  };
};

const getTempleBySlug = async (slug) => {
  return await templeRepo.findTempleBySlug(slug);
};

const getNearbyTemples = async ({ lat, lng, radius = 5000 }) => {
  if (!lat || !lng) {
    throw new Error("Latitude and Longitude required");
  }

  const temples = await templeRepo.findNearbyTemples(lat, lng, radius);
  return {
    temples,
    totalCount: temples.length
  };
};

const getMyTemples = async (userId) => {
  const temples = await templeRepo.findTemplesByContributor(userId);
  return {
    temples,
    totalCount: temples.length
  };
};

const createTemple = async (data, userId) => {

  const existingTemple = await templeRepo.findTempleByName(data.name);

  if (existingTemple) {
    throw new Error("Temple already exists");
  }

  if (!data.slug && data.name) {
    data.slug = slugify(data.name, { lower: true, strict: true });
  }

  const temple = await templeRepo.createTemple({
    ...data,
    contributor: userId,
    status: "pending"
  });

  return temple;
};

const updateTempleStatus = async (id, status) => {

  const temple = await templeRepo.updateTempleStatus(id, status);

  if (!temple) {
    throw new Error("Temple not found");
  }

  return temple;
};

const approveTemple = async (id, adminId) => {

  const temple = await templeRepo.updateTempleStatus(id, {
    status: "approved",
    approvedBy: adminId,
    approvedAt: new Date()
  });

  if (!temple) {
    throw new Error("Temple not found");
  }

  return temple;
};

const rejectTemple = async (id, reason) => {

  const temple = await templeRepo.updateTempleStatus(id, {
    status: "rejected",
    rejectedReason: reason
  });

  if (!temple) {
    throw new Error("Temple not found");
  }

  return temple;
};

module.exports = {
  getTemples,
  getPendingTemples,
  getTempleBySlug,
  getNearbyTemples,
  createTemple,
  updateTempleStatus,
  approveTemple,
  rejectTemple,
  getMyTemples
};