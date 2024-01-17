const fs = require('fs/promises')
const path = require('path')

const secretFolderName = 'secret-folder'
const secretFolderPath = path.join(__dirname, secretFolderName)

async function showFilesInformationInFolder() {
    const files = await fs.readdir(secretFolderPath, { withFileTypes: true })

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(secretFolderPath, file.name)
        const fileStat = await fs.stat(filePath)
        const fileSize = fileStat.size / 1024
        const fileExtension = path.extname(file.name).slice(1)

        console.log(`${path.basename(file.name, '.' + fileExtension)} - ${fileExtension} - ${fileSize.toFixed(3)}kb`)
      }
    }

}

showFilesInformationInFolder()
