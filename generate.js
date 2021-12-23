const fs = require('fs')
const path = require('path')
const [, , day] = process.argv
const template = `const fs = require('fs')
const path = require('path')
const inputRaw = fs.readFileSync(path.join(__dirname, 'input')).toString('utf8').split('\\n')
const input = inputRaw.slice(0, inputRaw.length - 1)
`
const folder = path.join(__dirname, `day-${day}`)
if (fs.existsSync(folder)) {
  console.error(`\nError: Folder for day ${day} already exists\n`)
  process.exit(1)
}
fs.mkdirSync(folder)
fs.writeFileSync(path.join(folder, 'index.js'), template, 'utf8')
fs.writeFileSync(path.join(folder, 'input'), '', 'utf8')
