const express = require('express')
const router = express.Router()
const controller = require("../controller/controller")
const {validateFolder,validateResults} = require("../middleware/express-validator")

router.get("/", controller.getIndex)

module.exports = router;