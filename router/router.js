const express = require('express')
const router = express.Router()
const controller = require("../controller/controller")
const { validateUser, validateResults } = require("../middleware/express-validator")
const { asyncWrapper } = require("../middleware/async-wrapper")

router.get("/", asyncWrapper(controller.getIndex))
router.get("/signup", asyncWrapper(controller.getSignup))
router.post("/signup", validateUser, validateResults, asyncWrapper(controller.postSignup))
router.get("/login", asyncWrapper(controller.getLogin))
router.post("/login", asyncWrapper(controller.postLogin))
router.get("/logout", asyncWrapper(controller.getLogout))

module.exports = router;