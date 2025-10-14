// src/utils/pathConfig.js
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, '../uploads'); // or '../public/uploads'

module.exports = { UPLOAD_DIR };