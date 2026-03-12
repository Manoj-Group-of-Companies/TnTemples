const masterRepo = require("../repositories/masterRepository");

const createMaster = async (type, data) => {
  return await masterRepo.createMaster(type, data);
};

const getMasters = async (type) => {
  const masters = await masterRepo.getMasters(type);
  return {
    masters,
    totalCount: masters.length
  };
};

const updateMaster = async (type, id, data) => {
  return await masterRepo.updateMaster(type, id, data);
};

const deleteMaster = async (type, id) => {
  return await masterRepo.deleteMaster(type, id);
};

module.exports = {
  createMaster,
  getMasters,
  updateMaster,
  deleteMaster
};