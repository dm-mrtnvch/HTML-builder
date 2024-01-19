const fs = require('fs/promises')
const path = require('path')

const projectDirectory = getDirectoryPath({subPath: 'project-dist'})
const componentsDirectory = getDirectoryPath({subPath: 'components'})
const stylesDirectory = getDirectoryPath({subPath: 'styles'})
const assetsDirectory = getDirectoryPath({subPath: 'assets'})

function getDirectoryPath({directory = __dirname, subPath = ''} = {}) {
  return path.join(directory, subPath)
}

async function buildPage() {
  await fs.mkdir(projectDirectory, {recursive: true})
  await replaceTemplateTags()
  await compileStyles()
  await copyDirectory(assetsDirectory, getDirectoryPath({
    directory: projectDirectory,
    subPath: 'assets'
  }))
}

async function replaceTemplateTags() {
  let template = await fs.readFile(getDirectoryPath({subPath: 'template.html'}), 'utf-8')
  const files = await fs.readdir(componentsDirectory, {withFileTypes: true})

  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.html') {
      const name = path.basename(file.name, '.html')
      const html = await fs.readFile(getDirectoryPath({
        directory: componentsDirectory,
        subPath: file.name
      }), 'utf-8')
      template = template.replace(new RegExp(`{{${name}}}`, 'g'), html)
    }
  }

  await fs.writeFile(getDirectoryPath({
    directory: projectDirectory,
    subPath: 'index.html'
  }), template)
}

async function compileStyles() {
  const files = await fs.readdir(stylesDirectory, {withFileTypes: true})
  let bundleStyles = ''

  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const styles = await fs.readFile(getDirectoryPath({
        directory: stylesDirectory,
        subPath: file.name
      }), 'utf8')
      bundleStyles += styles + '\n'
    }
  }

  await fs.writeFile(getDirectoryPath({
    directory: projectDirectory,
    subPath: 'style.css'
  }), bundleStyles)
}

async function copyDirectory(source, destination) {
  await fs.mkdir(destination, {recursive: true})
  const entities = await fs.readdir(source, {withFileTypes: true})

  for (let entity of entities) {
    const sourcePath = getDirectoryPath({
      directory: source,
      subPath: entity.name
    })
    const destinationPath = getDirectoryPath({
      directory: destination,
      subPath: entity.name
    })

    if (entity.isDirectory()) {
      await copyDirectory(sourcePath, destinationPath)
    } else {
      await fs.copyFile(sourcePath, destinationPath)
    }
  }
}

buildPage()
