const express = require('express')
const router = express.Router()
const controller = require("../controller/controller")
const {validateResults, validateFolder } = require("../middleware/express-validator")
const { uploadFile } = require("../middleware/multer")
const { asyncWrapper } = require("../middleware/async-wrapper")

router.get("/upload", asyncWrapper(controller.getUpload))
router.post("/upload", uploadFile, asyncWrapper(controller.postUpload))
router.post("/upload/create/folder", validateFolder, validateResults, asyncWrapper(controller.postFolder))

router.get("/:userid/folder/:folderid/files", asyncWrapper(controller.getFolder))
router.post("/:userid/folder/:folderid/create", validateFolder, validateResults, asyncWrapper(controller.postChildFolder))
router.post("/:userid/folder/:folderid/delete", asyncWrapper(controller.postDeleteFolder))
router.post("/:userid/folder/:folderid/edit", asyncWrapper(controller.postEditFolder))
router.post("/:userid/folder/:folderid/upload", uploadFile, asyncWrapper(controller.postUploadToFolder))

router.post("/:userid/file/:fileid/delete", asyncWrapper(controller.postDeleteFile))
router.post("/:userid/file/:fileid/edit", asyncWrapper(controller.postEditFile))
router.get("/:userid/file/:fileid/download", asyncWrapper(controller.downloadFile))
module.exports = router