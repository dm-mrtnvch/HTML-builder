const fs = require('fs')
const readline = require('readline')
const path = require('path')

const guidePhrase = 'Enter text or type "exit" (ctrl + c) to quit:'
const farewellPhrase = 'Best regards!'

const fileName = 'text.txt'
const filePath = path.join(__dirname, fileName)
const fileStream = fs.createWriteStream(filePath, {flags: 'a'})

const userConsole = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log(guidePhrase)

userConsole.on('line', (input) => {
  const isExit = input.toLowerCase() === 'exit'

  return isExit
    ? userConsole.close()
    : fileStream.write(input + '\n')
})

userConsole.on('close', () => {
  fileStream.end()
  console.log(farewellPhrase)
  process.exit();
})
