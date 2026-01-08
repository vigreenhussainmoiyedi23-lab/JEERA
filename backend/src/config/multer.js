const multer = require('multer');

// Use memory storage to get the file buffer in req.file.buffer
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

module.exports = upload;