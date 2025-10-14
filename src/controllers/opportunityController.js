// src/controllers/opportunityController.js
const Opportunity = require('../models/Opportunity');

// Create new opportunity (supporter or admin only)
exports.createOpportunity = async (req, res, next) => {
  try {
    const { title, description, type, skillsRequired, location, expiresAt } = req.body;

    // Only supporters or admins can create opportunities
    if (req.user.role !== 'supporter' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only supporters or admins can post opportunities'
      });
    }

    const opportunity = await Opportunity.create({
      title,
      description,
      type,
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : [],
      location,
      postedBy: req.user._id,
      expiresAt
    });

    res.status(201).json({
      success: true,
      message: 'Opportunity created successfully',
       opportunity
    });
  } catch (error) {
    next(error);
  }
};

// Get all open opportunities (public)
exports.getAllOpportunities = async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find({ status: 'open' })
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: opportunities.length,
       opportunities
    });
  } catch (error) {
    next(error);
  }
};

// Get opportunity by ID (public)
exports.getOpportunityById = async (req, res, next) => {
  try {
    const opp = await Opportunity.findById(req.params.id).populate('postedBy', 'name email');
    if (!opp) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }
    res.status(200).json({
      success: true,
       opp
    });
  } catch (error) {
    next(error);
  }
};