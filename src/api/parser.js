const fs = require('fs');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);

const getPackages = async filePath => {
  const content = await readFile(filePath, 'utf8');
  console.log(content.split('\n\n').length);
  return content
    .split('\n\n')
    // .slice(0, 5)
    .map(parsePackage);
};

const parsePackage = (string, index) => {
  try {
    return {
      name: parseName(string),
      description: parseDescription(string),
      dependencies: parseDependencies(string)
    }
  } catch (error) {
    console.log(string);
    throw new Error(`Failed to parse entry ${index}: ${error.message}`);
  }
};

const parseName = string => {
  const matches = string.match(/Package:\s(.+)\n/);
  if (matches && matches[1]) {
    return matches[1];
  }
  throw new Error(`Key "Package" not found`);
};

const parseDescription = string => {
  const matches = string.match(/Description:\s(.+\n(\s.+\n)*)/);
  if (matches && matches[1]) {
    return matches[1];
  }
  throw new Error(`Key "Description" not found`);
}

const parseDependencies = string => {
  const matches = string.match(/\nDepends:\s(.+)\n/);
  if (!matches || !matches[1]) {
    // No dependencies for this package
    return [];
  }
  const dependenciesLine = matches[1];
  /*
   * E.g.  
   * 'libc6 (>= 2.2.5), dpkg (>= 1.15.4) | install-info' -> ['libc6', 'dpkg', TODO ]
   */
  // TODO Handle if invalid format
  const dependencies = dependenciesLine
    .split(', ')
    .map(string => string.split(' ').shift());    

  return dependencies
    .filter((element, index) => dependencies.indexOf(element) === index);
};

module.exports = {
  getPackages
};
