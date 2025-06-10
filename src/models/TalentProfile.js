const mongoose = require('mongoose');

const portfolioItemSchema = new mongoose.Schema({
    url: { type: String, required: true },
    description: { type: String },
    fileType: { 
        type: String, 
        enum: ['image', 'document'], 
        required: true 
    }, // Added field
    uploadedAt: { type: Date, default: Date.now }
});

const talentProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bio: {
        type: String,
        required: true,
        trim: true
    },
    skills: [{
        type: String,
        trim: true
    }],
    portfolio: [portfolioItemSchema], // Updated subdocument array
    isDeleted: {
  type: Boolean,
  default: false
}

}, {
    timestamps: true
});

module.exports = mongoose.model('TalentProfile', talentProfileSchema);
