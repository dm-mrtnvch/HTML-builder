const fs = require('fs/promises')
const path = require('path')

const sourceFolderName = 'files'
const sourceDirectory = path.join(__dirname, sourceFolderName)
const destinationFolderName = 'files-copy'
const destinationDirectory = path.join(__dirname, destinationFolderName)

async function copyDir() {
  await fs.mkdir(destinationDirectory, {recursive: true})

  const files = await fs.readdir(sourceDirectory)
  const existingFiles = await fs.readdir(destinationDirectory)

  for (const file of existingFiles) {
    await fs.unlink(path.join(destinationDirectory, file))
  }

  for (const file of files) {
    const srcFile = path.join(sourceDirectory, file)
    const destFile = path.join(destinationDirectory, file)
    await fs.copyFile(srcFile, destFile)
  }
}

copyDir()
