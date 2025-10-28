const mongoose = require('mongoose');

const matchRequestSchema = new mongoose.Schema({
  // The refugee/talent submitting the request
  talent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async function(value) {
        const user = await mongoose.model('User').findById(value);
        return user && user.role === 'participant';
      },
      message: 'Talent must be a user with role "participant"'
    }
  },
  // The opportunity being requested
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: true
  },
  // AI-generated match score (0.0 to 1.0)
  matchScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0,
    required: true
  },
  // Current status of the request
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'fulfilled'],
    default: 'pending',
    required: true
  },
  // Optional message from talent
  message: {
    type: String,
    trim: true,
    maxlength: 500
  },
  // Who reviewed/approved/rejected the request (admin or supporter)
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: async function(value) {
        if (!value) return true; // Optional field
        const user = await mongoose.model('User').findById(value);
        return user && (user.role === 'admin' || user.role === 'supporter');
      },
      message: 'Reviewed by must be an admin or supporter'
    }
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Indexes for performance
matchRequestSchema.index({ talent: 1, status: 1 });
matchRequestSchema.index({ opportunity: 1 });
matchRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('MatchRequest', matchRequestSchema);
