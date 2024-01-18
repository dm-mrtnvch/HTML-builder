const fs = require('fs/promises')
const path = require('path')

const stylesDirectory = path.join(__dirname, 'styles')
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css')

async function buildCSSBundle() {
  const files = await fs.readdir(stylesDirectory, {withFileTypes: true})
  let bundleContent = ''

  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const filePath = path.join(stylesDirectory, file.name)
      const fileContent = await fs.readFile(filePath, 'utf8')
      bundleContent += fileContent + '\n'
    }
  }

  await fs.writeFile(bundlePath, bundleContent)
}

buildCSSBundle()
