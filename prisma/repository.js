const { PrismaClient, Prisma } = require("@prisma/client")
const prisma = new PrismaClient()

exports.signup = async (name, username, password) => {
    const user = await prisma.user.create({
        data: {
            fullname: name,
            username: username,
            password: password
        }
    })
}

exports.createFolder = async (username, name) => {
    const folder = await prisma.folder.create({
        data: {
            name: name,
            user: {
                connect: { username: username }
            }
        }
    })
}

exports.getRootFolders = async (userid) => {
    const folders = await prisma.folder.findMany({
        where: {
            user: {
                id: userid,
            },
            folderId: null
        },
        select: {
            id: true,
            name: true,
            userId: true,
        },
    })
    return folders
}

exports.getFolderPath = async (folderid) => {
    return await prisma.$queryRaw
        `
    WITH RECURSIVE folderpath as (
        select f.id, f.name, f."folderId", f."userId"
        from "Folder" f
        where id = ${folderid}
        union 
        select f.id, f.name, f."folderId", f."userId"
        from "Folder" as f
        JOIN folderpath fp ON fp."folderId" = f.id
    )
    select * from folderpath;
    `
}

exports.getFolder = async (folderid) => {
    const folder = await prisma.folder.findUnique({
        where: {
            id: folderid
        },
    })
    return folder
}

exports.createChildFolder = async (folderid, name, userid) => {
    const folder = await prisma.folder.create({
        data: {
            name: name,
            user: {
                connect: {
                    id: userid
                }
            },
            folder: {
                connect: {
                    id: folderid
                }
            }
        }
    })
}

exports.getChildFolders = async (folderid) => {
    const folders = await prisma.folder.findMany({
        where: {
            folderId: folderid
        },
        include: {
            folder: true,
        }
    })
    return folders
}

exports.deleteFolder = async (folderid) => {
    const deleteFolder = await prisma.folder.delete({
        where: {
            id: folderid
        }
    })
}

exports.updateFolder = async (folderid, name) => {
    const updateFolder = await prisma.folder.update({
        where: {
            id: folderid
        },
        data: {
            name: name,
        },
    })
}