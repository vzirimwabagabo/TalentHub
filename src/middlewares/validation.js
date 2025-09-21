// src/middlewares/validation.js
const { body } = require("express-validator");

// Registration validation
exports.registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
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

// ✅ TALENT PROFILE VALIDATIONS — YOU WERE MISSING THESE!
exports.createTalentProfileValidation = [
  body('bio')
    .notEmpty()
    .withMessage('Bio is required'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  body('headline')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Headline must be under 100 characters')
];

exports.updateTalentProfileValidation = [
  body('bio')
    .optional()
    .isString(),
  body('skills')
    .optional()
    .isArray(),
  body('headline')
    .optional()
    .isString()
    .isLength({ max: 100 })
];