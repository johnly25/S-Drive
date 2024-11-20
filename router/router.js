const express = require('express')
const router = express.Router()
const controller = require("../controller/controller")
const {validateUser,validateResults} = require("../middleware/express-validator")

router.get("/", controller.getIndex)
router.get("/signup", controller.getSignup)
router.post("/signup", validateUser, validateResults, controller.postSignup)
router.get("/login", controller.getLogin)
router.post("/login", controller.postLogin)
router.get("/logout", controller.getLogout)

module.exports = router;