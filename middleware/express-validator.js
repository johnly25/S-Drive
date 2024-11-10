const { body, validationResult, check } = require("express-validator")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()


const checkPasswordConfirm = () =>
    body('password-confirm').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords confirmation does not match password')
        }
        return true
    })

const checkUsername = () =>
    body('username').custom(async value => {
        const user = await prisma.user.findUnique({
            where: {
                username: value
            }
        })
        if (user) {
            throw new Error('Username exists already')
        }
        return true
    })

exports.validateUser = [
    body('first-name')
        .notEmpty().withMessage('first name required'),
    body('last-name')
        .notEmpty().withMessage('last name required'),
    body('username')
        .notEmpty().withMessage('username required'),
    body('password')
        .notEmpty().withMessage('password required'),
    body('password-confirm')
        .notEmpty().withMessage('password confirmation required'),
    checkPasswordConfirm(),
    checkUsername()
]

exports.validateFolder = [
    body('folder-name')
        .notEmpty().withMessage('Folder requires name')
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage('Folder name must only contain letters, numbers, dashes, and underscores.')
]
exports.validateResults = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        // return res.status(200).json({ errors: errors.array() });
        res.locals.errors = errors.array()
    next()
}

