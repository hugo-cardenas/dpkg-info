const fs = require('fs');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);

const getPackages = async filePath => {
  const content = await readFile(filePath, 'utf8');
  const packages = content
    .split('\n\n')
    .filter(block => block.trim() !== '')
    // .filter(block => block.indexOf('Package: linux-image-3.2.0-35-generic') >= 0)
    .map(parsePackage);

  const packagesByName = packages.reduce((packagesByName, pkg) => {
    return {
      ...packagesByName,
      [pkg.name]: pkg
    };
  }, {});

  // Calculate dependentPackages property
  Object.keys(packagesByName)
    .forEach(name => {
      const pkg = packagesByName[name];
      const flatDependencies = [].concat(
        ...pkg.dependencies.map(dependency => [
          dependency.main,
          ...dependency.alternatives
        ])
      );
      flatDependencies.forEach(dependencyName => {
        if (packagesByName[dependencyName] &&
          !packagesByName[dependencyName].dependentPackages.includes(name)) {
          packagesByName[dependencyName].dependentPackages.push(name);
        }
      });
    });

  return packagesByName;
};

const parsePackage = (string, index) => {
  try {
    return {
      name: parseName(string),
      description: parseDescription(string),
      dependencies: parseDependencies(string),
      dependentPackages: []
    }
  } catch (error) {
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

  // 'libc6 (>= 2.2.5)' -> 'libc6'
  const parsePackageName = packageString => packageString.split(' ').shift();

  /*
   * E.g.  
   * 'libc6 (>= 2.2.5), dpkg (>= 1.15.4) | install-info' -> 
   * [{ main: 'libc6', alternatives: [] }, { main: 'dpkg', alternatives: ['install-info'] }]
   */
  const dependencies = dependenciesLine
    .split(', ')
    .map(string => {
      const packages = string.split(' | ');
      const dependency = {
        main: parsePackageName(packages.shift()),
        alternatives: packages.map(parsePackageName)
      };
      return dependency;
    });

  // Filter out duplicates comparing by dependency.main 
  return dependencies
    .filter((dependency, index) =>
      dependencies.findIndex(otherDependency => otherDependency.main === dependency.main) === index
    );
};

module.exports = {
  getPackages
};
