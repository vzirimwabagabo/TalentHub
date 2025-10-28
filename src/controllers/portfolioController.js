const portfolioService = require('../services/portfolioService');

exports.createPortfolio = async (req, res, next) => {
  try {
    const portfolio = await portfolioService.createPortfolio(req.body);
    res.status(201).json({ success: true, data: portfolio });
  } catch (error) {
    next(error);
  }
};

exports.getAllPortfolios = async (req, res, next) => {
  try {
    const portfolios = await portfolioService.getAllPortfolios();
    res.status(200).json({ success: true, data: portfolios });
  } catch (error) {
    next(error);
  }
};

exports.getPortfolioById = async (req, res, next) => {
  try {
    const portfolio = await portfolioService.getPortfolioById(req.params.id);
    if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found' });
    res.status(200).json({ success: true, data: portfolio });
  } catch (error) {
    next(error);
  }
};

exports.updatePortfolio = async (req, res, next) => {
  try {
    const updatedPortfolio = await portfolioService.updatePortfolio(req.params.id, req.body);
    res.status(200).json({ success: true, data: updatedPortfolio });
  } catch (error) {
    next(error);
  }
};

exports.deletePortfolio = async (req, res, next) => {
  try {
    await portfolioService.deletePortfolio(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
