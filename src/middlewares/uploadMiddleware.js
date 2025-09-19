// src/middlewares/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define base upload directory relative to project root
const UPLOAD_ROOT = path.join(__dirname, '../../uploads');

// Ensure main uploads folder exists
if (!fs.existsSync(UPLOAD_ROOT)) {
  fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}

// Full path for portfolio files
const PORTFOLIO_PATH = path.join(UPLOAD_ROOT, 'portfolio');
if (!fs.existsSync(PORTFOLIO_PATH)) {
  fs.mkdirSync(PORTFOLIO_PATH, { recursive: true });
}

// Supported file type checks
function isValidFileType(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  // Image: jpeg, png, gif, webp
  if (mime.startsWith('image/') || ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
    return 'image';
  }

  // Video: mp4, mov, webm, etc.
  if (mime.startsWith('video/') || ['.mp4', '.mov', '.webm', '.avi', '.flv'].includes(ext)) {
    return 'video';
  }

  // PDF
  if (mime === 'application/pdf' || ext === '.pdf') {
    return 'pdf';
  }

  return null;
}

// Custom Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Destination requested:", file);
    cb(null, PORTFOLIO_PATH); // Save to /uploads/portfolio
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `refutalent_${uniqueSuffix}${ext}`);
  }
});

// File Filter
const fileFilter = (req, file, cb) => {
  const fileType = isValidFileType(file);

  if (!fileType) {
    return cb(new Error('Only images, videos, and PDFs are allowed.'), false);
  }

  // Pass metadata to controller via request
  req.fileType = fileType; // e.g., 'image', 'video', 'pdf'
  cb(null, true);
};

// Multer instance with limits
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50 MB max
  }
});

module.exports = upload;