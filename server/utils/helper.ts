const path = require('path');

export default {
  removeExtensionFromFile: (filename: string) => path.parse(filename).name
}