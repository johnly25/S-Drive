const maxSize = 10485760;
const multer = require('multer')
const storage = multer.memoryStorage();

module.exports = multer({ storage: storage, limits: {filzeSize: maxSize}})