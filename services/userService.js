const repository = require("../prisma/repository")
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(process.env.STORAGE_URL, process.env.STORAGE_SECRET_ROLE_API_KEY)
const { v4: uuidv4 } = require('uuid');


exports.UserService = class UserService {
    constructor() {
    }

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

    uploadFile = async (username, file) => {
        const fileName = uuidv4()
        const bufferName = (Buffer.from(file.originalname, 'latin1').toString('utf8'))
        const originalName = file.originalname
        const uploadName = username + '/' + fileName
        const { data, error } = await supabase.storage.from('uploads').upload(uploadName, file.buffer, {
            contentType: file.mimetype,
            upsert: true,
        })
        if (error) {
            console.log('error occured')
            console.log(error)
        } else {
            console.log('file uploaded!')
            console.log(data)
            const url = await supabase.storage.from('uploads').getPublicUrl(uploadName)
            console.log(url)
        }
    }

    createFolder = async (username, name) => {
        await repository.createFolder(username, name)
    }

    getFolders = async (userid) => {
        return await repository.getRootFolders(userid)
    }

    getFolderPath = async (folderId) => {
        const folderPath =  await repository.getFolderPath(folderId)
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

    deleteFolder = async(folderid) => {
        return await repository.deleteFolder(folderid)
    }

    updateFolder = async (folderid, name) => {
        return await repository.updateFolder(folderid, name)
    }
}