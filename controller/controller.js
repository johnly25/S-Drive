const { UserService } = require("../services/userService")
const { isEmpty } = require("../utils/utils")
const userService = new UserService()
const https = require("https");
const passport = require('passport')

exports.getIndex = async (req, res) => {
    const user = res.locals.currentUser
    if (user) {
        const userid = user.id
        const folders = await userService.getFolders(userid)
        const files = await userService.getFiles(userid)
        res.render("index", { user: user, folders: folders, files: files })
    } else {
        res.render("index")
    }
}

exports.getSignup = (req, res) => {
    res.render("signup")
}

exports.postSignup = (req, res) => {
    const errors = res.locals.errors
    if (!isEmpty(errors)) {
        return res.status(400).render("signup", { errors: errors })
    }
    const userData = req.body
    userService.signup(userData)
    res.redirect('/')
}

exports.getUpload = async (req, res) => {
    const user = res.locals.currentUser
    const userid = user.id
    const folders = await userService.getFolders(userid)
    const files = await userService.getFiles(userid)
    res.render("upload", { user: user, folders: folders, files: files })
}

exports.postUpload = async (req, res) => {
    const user = res.locals.currentUser
    const userid = user.id
    const username = user.username
    if (res.locals.currentUser && req.file) {
        await userService.uploadFile(req.file, userid)
    }
    res.redirect("/")
}

exports.getLogin = (req, res) => {
    const error = (req.flash('error'))
    res.render("login", { error: error })
}

exports.postFolder = (req, res) => {
    if (res.locals.errors) {
        res.render("index", { errors: res.locals.errors })
    } else if (res.locals.currentUser) {
        const { "folder-name": name } = req.body
        userService.createFolder(res.locals.currentUser.username, name)
        res.redirect("/")
    }
}

exports.postLogin =
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    })


exports.getLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        res.redirect("/")
    })
}

exports.getFolder = async (req, res) => {
    const userId = req.params.userid
    const folderid = Number(req.params.folderid)
    const currentUser = res.locals.currentUser
    const currentUserId = res.locals.currentUser.id
    if (userId == currentUserId) {
        const folders = await userService.getChildFolders(folderid)
        const folderPath = await userService.getFolderPath(folderid)
        const files = await userService.getFilesInFolder(folderid)
        res.render('index', { user: currentUser, folders: folders, folderid: folderid, folderPath: folderPath, files: files })
    } else {
        res.redirect('/')
    }
}

exports.postChildFolder = async (req, res) => {
    if (res.locals.errors) {
        res.render("index", { errors: res.locals.errors })
    } else {
        const userid = req.params.userid
        const folderid = req.params.folderid
        const currentUserId = res.locals.currentUser.id
        const { "folder-name": name } = req.body
        if (userid == currentUserId) {
            userService.createChildFolder(currentUserId, folderid, name)
        }
        res.redirect("/")
    }
}

exports.postDeleteFolder = async (req, res) => {
    const userid = req.params.userid
    const folderid = Number(req.params.folderid)
    userService.deleteFolder(folderid)
    res.redirect("/")
}

exports.postEditFolder = async (req, res) => {
    const name = req.body.name
    const folderid = Number(req.params.folderid)
    userService.updateFolder(folderid, name)
    res.redirect("/")
}

exports.postUploadToFolder = async (req, res) => {
    const user = res.locals.currentUser
    const userid = user.id
    const username = user.username
    const folderid = Number(req.params.folderid)
    if (req.file) {
        userService.uploadToFolder(req.file, userid, folderid)
    }
    res.redirect("/")
}

exports.postDeleteFile = async (req, res) => {
    const userid = req.params.userid
    const fileid = Number(req.params.fileid)
    await userService.deteleFileinStorage(userid, fileid)
    await userService.deleteFile(fileid)
    res.redirect("/")
}

exports.postEditFile = async (req, res) => {
    const name = req.body.name
    const fileid = Number(req.params.fileid)
    userService.updateFile(fileid, name)
    res.redirect("/")
}

exports.downloadFile = async (req, res, next) => {
    const fileid = Number(req.params.fileid)
    const file = await userService.getFile(fileid)
    const url = file.url
    const filename = file.name
    
    var externalReq = https.request(url, (file) => {
        try {
            res.setHeader("content-disposition", "attachment; filename=" + filename);
            file.pipe(res);
        } catch (err) {
            next(err)
        }
    }); 
    externalReq.on('error', (err) =>{
        next(err)
    })
    externalReq.end();
 
}