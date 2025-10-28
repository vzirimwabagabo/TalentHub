const authService = require('../services/authService');
const { success, error } = require('../utils/response');

exports.registerUser = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    success(res, 'Registration successful', user, 201);
  } catch (err) {
    error(res, err.message, err.statusCode);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    success(res, 'Login successful', user);
  } catch (err) {
    error(res, err.message, err.statusCode);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email, req.protocol, req.get('host'));
    success(res, 'Password reset email sent');
  } catch (err) {
    error(res, err.message, err.statusCode);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    await authService.resetPassword(token, password);
    success(res, 'Password reset successful');
  } catch (err) {
    error(res, err.message, err.statusCode);
  }
};

