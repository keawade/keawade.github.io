import fs from 'fs'
console.log(fs)

const list = fs.readdirSync('./', (err, files) => {
  if (err) {
    console.error('failed', err)
  }
  files.forEach((file) => {
    console.log(file)
  })
  return files
})

export default list
