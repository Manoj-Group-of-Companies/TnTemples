const Deity = require("../models/Deity");
const District = require("../models/District");
const Festival = require("../models/Festival");

const getModel = (type) => {
  switch (type) {
    case "deity":
      return Deity;
    case "district":
      return District;
    case "festival":
      return Festival;
    default:
      return null;
  }
};

const createMaster = async (type, data) => {
  const Model = getModel(type);
  if (!Model) throw new Error("Invalid master type");

  return await Model.create(data);
};

const getMasters = async (type) => {
  const Model = getModel(type);
  if (!Model) throw new Error("Invalid master type");

  return await Model.find().sort({ name: 1 });
};

const updateMaster = async (type, id, data) => {
  const Model = getModel(type);
  if (!Model) throw new Error("Invalid master type");

  return await Model.findByIdAndUpdate(id, data, { new: true });
};

const deleteMaster = async (type, id) => {
  const Model = getModel(type);
  if (!Model) throw new Error("Invalid master type");

  return await Model.findByIdAndDelete(id);
};

module.exports = {
  createMaster,
  getMasters,
  updateMaster,
  deleteMaster
};