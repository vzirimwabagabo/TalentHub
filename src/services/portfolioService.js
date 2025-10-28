const Portfolio = require('../models/Portfolio');

async function createPortfolio(data) {
  const portfolio = new Portfolio(data);
  return await portfolio.save();
}

async function getAllPortfolios() {
  return await Portfolio.find().populate('talentProfile');
}

async function getPortfolioById(id) {
  return await Portfolio.findById(id).populate('talentProfile');
}

async function updatePortfolio(id, data) {
  return await Portfolio.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

async function deletePortfolio(id) {
  return await Portfolio.findByIdAndDelete(id);
}

module.exports = {
  createPortfolio,
  getAllPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
};
