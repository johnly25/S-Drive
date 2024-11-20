const repository = require("../prisma/repository")
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(process.env.STORAGE_URL, process.env.STORAGE_SECRET_ROLE_API_KEY)
const { v4: uuidv4 } = require('uuid');


exports.UserService = class UserService {
    signup = async (userData) => {
        const { "first-name": firstName, "last-name": lastName, username, password } = userData
        const fullname = firstName + ' ' + lastName
        bcrypt.hash(password, 10, function (err, hash) {
            if (err) {
            } else {
                repository.signup(fullname, username, hash)
            }
        });
    }

    uploadToFolder = async (file, userid, folderid) => {
        const uploadName = userid + '/' + uuidv4()
        const bufferName = (Buffer.from(file.originalname, 'latin1').toString('utf8'))
        await this.storeFile(file, uploadName)
        const { data: { publicUrl: url } } = await supabase.storage.from('uploads').getPublicUrl(uploadName)
        const size = file.size
        const originalName = file.originalname
        await repository.uploadToFolder(userid, folderid, bufferName, uploadName, url, size)
    }

    uploadFile = async (file, userid) => {
        const uploadName = userid + '/' + uuidv4()
        const bufferName = (Buffer.from(file.originalname, 'latin1').toString('utf8'))
        await this.storeFile(file, uploadName)

        const { data: { publicUrl: url } } = await supabase.storage.from('uploads').getPublicUrl(uploadName)
        const size = file.size
        const originalName = file.originalname
        await repository.uploadFile(userid, bufferName, uploadName, url, size)

    }

    storeFile = async (file, uploadName) => {
        const { data, error } = await supabase.storage.from('uploads').upload(uploadName, file.buffer, {
            contentType: file.mimetype,
            upsert: true,
        })
        if (error) {
            return Error;
        }
    }

    createFolder = async (username, name) => {
        await repository.createFolder(username, name)
    }

    getFolders = async (userid) => {
        return await repository.getRootFolders(userid)
    }

    getFolderPath = async (folderId) => {
        const folderPath = await repository.getFolderPath(folderId)
        return folderPath.reverse()
    }

    createChildFolder = async (userid, folderid, name) => {
        const folder = await repository.getFolder(Number(folderid))
        const folderUser = folder.userId
        if (userid == folderUser) {
            repository.createChildFolder(Number(folderid), name, folderUser)
        }
    }
    getChildFolders = async (folderid) => {
        return await repository.getChildFolders(folderid)
    }

    deleteFolder = async (folderid) => {
        return await repository.deleteFolder(folderid)
    }

    updateFolder = async (folderid, name) => {
        return await repository.updateFolder(folderid, name)
    }

    getFile = async (fileid) => {
        return await repository.getFile(fileid)
    }

    getFiles = async (userid) => {
        return await repository.getFiles(userid)
    }

    getFilesInFolder = async (folderid) => {
        return await repository.getFilesInFolder(folderid)
    }

    deleteFile = async (fileid) => {
        await repository.deleteFile(fileid)
    }

    deteleFileinStorage = async (userid, fileid) => {
        const file = await repository.getFile(fileid)
        const path = file.uploadName;
        const {data, error} = await supabase.storage.from('uploads').remove([path])
        if (error) {
            return Error;
        }
    }

    updateFile = async (fileid, name) => {
        await repository.updateFile(fileid, name)
    }
}