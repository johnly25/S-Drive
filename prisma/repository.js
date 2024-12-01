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

exports.uploadFile = async (userid, name, uploadName, url, size) => {
    const file = await prisma.file.create({
        data: {
            name: name,
            uploadName: uploadName,
            url: url,
            size: size,
            user: {
                connect: {
                    id: userid
                }
            }
        }
    })
}

exports.getFiles = async (userid) => {
    const files = await prisma.file.findMany({
        where: {
            user: {
                id: userid,
            },
            folderId: null
        }
    })
    return files
}

exports.getFilesInFolder = async (folderid) => {
    const files = await prisma.file.findMany({
        where: {
            folderId: folderid
        }
    })
    return files
}

exports.getFilesInFolders = async (folderid) => {
    return await prisma.$queryRaw
        `
        WITH RECURSIVE folderHierarchy as (
            SELECT f.id, f.name, f."folderId", f."userId"
            FROM "Folder" AS f
            WHERE id= ${folderid}
            UNION 
            SELECT f.id, f.name, f."folderId", f."userId"
            FROM "Folder" AS f
            JOIN folderHierarchy fh ON f."folderId" = fh.id
        )
        SELECT *
        FROM "File"
        WHERE "File"."folderId" IN (SELECT id FROM folderHierarchy);
        `

    }

exports.uploadToFolder = async (userid, folderid, name, uploadName, url, size) => {
    const file = await prisma.file.create({
        data: {
            name: name,
            uploadName: uploadName,
            url: url,
            size: size,
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

exports.deleteFile = async (fileid) => {
    const deleteFile = await prisma.file.delete({
        where: {
            id: fileid
        }
    })
}

exports.updateFile = async (fileid, name) => {
    const updateFile = await prisma.file.update({
        where: {
            id: fileid
        },
        data: {
            name: name,
        },
    })
}

exports.getFile = async (fileid) => {
    return await prisma.file.findUnique({
        where: {
            id: fileid
        }
    })
}

exports.deleteFiles = async (filesid) => {
    const deleteFile = await prisma.file.deleteMany({
        where: {
            id: { in: filesid },
          },
    })
}