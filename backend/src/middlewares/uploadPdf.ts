import multer from 'multer';
import ApiError from '../helpers/apiError.js';

const uploadPdf = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new ApiError(400, 'Only PDF files are allowed'));
    }
    cb(null, true);
  },
});

export default uploadPdf;
