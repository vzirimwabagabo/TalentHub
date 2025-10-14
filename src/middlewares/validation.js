// src/middlewares/validation.js
const { body } = require("express-validator");

// Registration validation
exports.registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(['participant', 'supporter', 'admin'])
    .withMessage("Role must be participant, supporter, or admin"),
  body("supporterType")
    .if(body("role").equals("supporter"))
    .isIn(['employer', 'donor', 'volunteer'])
    .withMessage("Supporter type must be employer, donor, or volunteer")
];

// Login validation
exports.loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Forgot password validation
exports.forgotPasswordValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
];

// Reset password validation
exports.resetPasswordValidation = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// ✅ Talent Profile Validations — Updated for Multilingual (en, fr, sw, rw)
exports.createTalentProfileValidation = [
  // Bio: en is required; others optional
  body('bio.en')
    .notEmpty()
    .withMessage('English bio is required'),
  body('bio.fr')
    .optional()
    .isString()
    .withMessage('French bio must be a string'),
  body('bio.sw')
    .optional()
    .isString()
    .withMessage('Swahili bio must be a string'),
  body('bio.rw')
    .optional()
    .isString()
    .withMessage('Kinyarwanda bio must be a string'),

  // Headline: all optional, max 100 chars
  body('headline.en')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('English headline must be under 100 characters'),
  body('headline.fr')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('French headline must be under 100 characters'),
  body('headline.sw')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Swahili headline must be under 100 characters'),
  body('headline.rw')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Kinyarwanda headline must be under 100 characters'),

  // Skills: optional array of strings
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  body('skills.*')
    .optional()
    .isString()
    .withMessage('Each skill must be a string')
];

// Update validation (all fields optional)
exports.updateTalentProfileValidation = [
  // Bio
  body('bio.en')
    .optional()
    .isString()
    .notEmpty()
    .withMessage('English bio cannot be empty'),
  body('bio.fr')
    .optional()
    .isString(),
  body('bio.sw')
    .optional()
    .isString(),
  body('bio.rw')
    .optional()
    .isString(),

  // Headline
  body('headline.en')
    .optional()
    .isString()
    .isLength({ max: 100 }),
  body('headline.fr')
    .optional()
    .isString()
    .isLength({ max: 100 }),
  body('headline.sw')
    .optional()
    .isString()
    .isLength({ max: 100 }),
  body('headline.rw')
    .optional()
    .isString()
    .isLength({ max: 100 }),

  // Skills
  body('skills')
    .optional()
    .isArray(),
  body('skills.*')
    .optional()
    .isString()
];