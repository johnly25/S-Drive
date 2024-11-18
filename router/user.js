const express = require('express')
const router = express.Router()
const controller = require("../controller/controller")

const { validateUser, validateResults, validateFolder } = require("../middleware/express-validator")

const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

router.get("/", controller.getIndex)
router.get("/signup", controller.getSignup)
router.post("/signup", validateUser, validateResults, controller.postSignup)
router.get("/login", controller.getLogin)
router.post("/login", controller.postLogin)
router.get("/logout", controller.getLogout)

router.get("/upload", controller.getUpload)
router.post("/upload", upload.single('uploaded_file'), controller.postUpload)
router.post("/upload/create/folder", validateFolder, validateResults, controller.postFolder)

router.get("/:userid/folder/:folderid/files", controller.getFolder)
router.post("/:userid/folder/:folderid/create",  validateFolder, validateResults, controller.postChildFolder)
router.post("/:userid/folder/:folderid/delete", controller.postDeleteFolder)
router.post("/:userid/folder/:folderid/edit", controller.postEditFolder)
router.post("/:userid/folder/:folderid/upload", upload.single('uploaded_file'), controller.postUploadToFolder)
router.post("/:userid/file/:fileid/delete", controller.postDeleteFile)
router.post("/:userid/file/:fileid/edit", controller.postEditFile)

module.exports = router