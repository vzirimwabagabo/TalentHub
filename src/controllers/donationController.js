// src/controllers/donationController.js

const Donation = require('../models/Donation');

// Create a new donation
exports.createDonation = async (req, res, next) => {
    try {
        const { amount, description } = req.body;
        const userId = req.user._id;

        const newDonation = await Donation.create({
            user: userId,
            amount,
            description
        });

        res.status(201).json({
            success: true,
            message: 'Donation recorded successfully',
            data: newDonation
        });
    } catch (error) {
        next(error);
    }
};

// Get all donations (Admin only)
exports.getAllDonations = async (req, res, next) => {
    try {
        const donations = await Donation.find().populate('user', 'name email');
        res.status(200).json({
            success: true,
            data: donations
        });
    } catch (error) {
        next(error);
    }
};

// Get donations by user
exports.getUserDonations = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const donations = await Donation.find({ user: userId });
        res.status(200).json({
            success: true,
            data: donations
        });
    } catch (error) {
        next(error);
    }
};
exports.getDonationById = async (req, res, next) => {
    try {
        const donation = await Donation.findById(req.params.id).populate('user', 'name email');
        if (!donation) {
            return res.status(404).json({ success: false, message: 'Donation not found' });
        }
        res.status(200).json({ success: true, data: donation });
    } catch (error) {
        next(error);
    }
};
exports.deleteDonation = async (req, res, next) => {
    try {
        const donation = await Donation.findByIdAndDelete(req.params.id);
        if (!donation) {
            return res.status(404).json({ success: false, message: 'Donation not found' });
        }
        res.status(200).json({ success: true, message: 'Donation deleted successfully' });
    } catch (error) {
        next(error);
    }
};
