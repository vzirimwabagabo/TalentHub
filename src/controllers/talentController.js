const TalentProfile = require('../models/TalentProfile');

// Create a new talent profile
exports.createTalentProfile = async (req, res, next) => {
    try {
        const { bio, skills, portfolio } = req.body;
        const userId = req.user._id;

        // Check if profile already exists
        const existingProfile = await TalentProfile.findOne({ user: userId });
        if (existingProfile) {
            return res.status(400).json({ success: false, message: 'Profile already exists' });
        }

        const newProfile = await TalentProfile.create({
            user: userId,
            bio,
            skills,
            portfolio
        });

        res.status(201).json({
            success: true,
            message: 'Talent profile created successfully',
            data: newProfile
        });
    } catch (error) {
        next(error);
    }
};

// Get the current user's talent profile
exports.getTalentProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const profile = await TalentProfile.findOne({
        user: userId,
        isDeleted: false 
        }).populate('user', 'name email role');

        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        next(error);
    }
};

// Update the current user's talent profile
exports.updateTalentProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { bio, skills, portfolio } = req.body;

        const profile = await TalentProfile.findOne({ user: userId });
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        profile.bio = bio || profile.bio;
        profile.skills = skills || profile.skills;
        profile.portfolio = portfolio || profile.portfolio;
        await profile.save();

        res.status(200).json({
            success: true,
            message: 'Talent profile updated successfully',
            data: profile
        });
    } catch (error) {
        next(error);
    }
};

// Delete the current user's talent profile
exports.deleteTalentProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const profile = await TalentProfile.findOneAndDelete({ user: userId, isDeleted: false });
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }
        profile.isDeleted = true;
        await profile.save()
        ;

        res.status(200).json({
            success: true,
            message: 'Talent profile deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Admin: Get all talent profiles
exports.getAllTalentProfiles = async (req, res, next) => {
    try {
        const profiles = await TalentProfile.find({isDeleted: false}).populate('user', 'name email role');
        res.status(200).json({
            success: true,
            data: profiles
        });
    } catch (error) {
        next(error);
    }
};

// Admin: Get a single talent profile
exports.getTalentProfileById = async (req, res, next) => {
    try {
        let profile = await TalentProfile.findById(req.params.id).populate('user', 'name email role');
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }
        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        next(error);
    }
};



// Upload a new portfolio image and add it to the user's profile
exports.uploadPortfolioImage = async (req, res, next) => {
    try {
        const userId = req.user._id;

        let profile = await TalentProfile.findOne({ user: userId });

        if (!profile) {
            // Create a new profile with an empty portfolio if one doesn't exist
            profile = new TalentProfile({
                user: userId,
                bio: 'No bio yet',
                skills: [],
                portfolio: []
            });
        }

        // Now push each uploaded file
        req.files.forEach(file => {
            const imageUrl = `/uploads/portfolio/${file.filename}`;
            profile.portfolio.push({ url: imageUrl });
        });

        await profile.save();

        res.status(200).json({
            success: true,
            message: 'Images uploaded and added to portfolio',
            data: profile
        });
    } catch (error) {
        next(error);
    }
};

exports.deletePortfolioImage = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { imageId } = req.params;

        const profile = await TalentProfile.findOne({ user: userId });
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        // Log current portfolio
        console.log("Current portfolio:", profile.portfolio);

        // Try to find the subdocument
        const image = profile.portfolio.id(imageId);
        console.log("Image to delete:", image);

        if (!image) {
            return res.status(404).json({ success: false, message: 'Image not found in portfolio' });
        }

        // Remove from database using .remove() or .pull()
        try {
            image.remove(); // works with subdocs
        } catch (err) {
            profile.portfolio.pull(imageId); // fallback
        }
        await profile.save();

        // Remove file from filesystem
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, '../../uploads/portfolio', image.url.split('/').pop());
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.status(200).json({
            success: true,
            message: 'Image removed from portfolio'
        });
    } catch (error) {
        console.error("Error deleting portfolio image:", error);
        next(error);
    }
};
