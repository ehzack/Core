const { hashElement } = require('folder-hash')

const options = {
   folders: { exclude: ['.*', 'node_modules', 'test_coverage'] },
   files: { include: ['*.ts', '*.json'] },
}

hashElement('src', options)
   .then((res) => {
      console.log(res.hash)
   })
   .catch((error) => {
      return console.error('hashing failed:', error)
   })
