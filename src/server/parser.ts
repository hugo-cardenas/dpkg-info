const fs = require('fs');
const { promisify } = require('util');
import {
  Dependency,
  Package,
  PackageDictionary
} from '../types';

const readFile = promisify(fs.readFile);

// interface Dependency {
//   main: string;
//   alternatives: Array<string>;
// };

// interface Package {
//   name: string;
//   description: string;
//   dependencies: Array<Dependency>;
//   dependentPackages: Array<string>;
// };

// interface PackageDictionary {
//   [name: string]: Package
// }

const getPackageDictionary = async (filePath: string): Promise<PackageDictionary> => {
  const content = await readFile(filePath, 'utf8');
  const packages = content
    .split('\n\n')
    .filter((block: string) => block.trim() !== '')
    .map(parsePackage);

  const packageDictionary = packages.reduce((dictionary: PackageDictionary, pkg: Package) => {
    return {
      ...dictionary,
      [pkg.name]: pkg
    };
  }, {});

  // Calculate dependentPackages property
  Object.keys(packageDictionary)
    .forEach(name => {
      const pkg = packageDictionary[name];
      const flatDependencies = [].concat(
        ...pkg.dependencies.map((dependency: Dependency) => [
          dependency.main,
          ...dependency.alternatives
        ])
      );
      flatDependencies.forEach(dependencyName => {
        if (packageDictionary[dependencyName] &&
          !packageDictionary[dependencyName].dependentPackages.includes(name)) {
          packageDictionary[dependencyName].dependentPackages.push(name);
        }
      });
    });

  return packageDictionary;
};

const parsePackage = (text: string, index: number): Package => {
  try {
    return {
      name: parseName(text),
      description: parseDescription(text),
      dependencies: parseDependencies(text),
      dependentPackages: []
    }
  } catch (error) {
    throw new Error(`Failed to parse entry ${index}: ${error.message}`);
  }
};

const parseName = (text: string): string => {
  const matches = text.match(/Package:\s(.+)\n/);
  if (matches && matches[1]) {
    return matches[1];
  }
  throw new Error(`Key "Package" not found`);
};

const parseDescription = (text: string): string => {
  const matches = text.match(/Description:\s(.+\n(\s.+\n)*)/);
  if (matches && matches[1]) {
    return matches[1];
  }
  throw new Error(`Key "Description" not found`);
}

const parseDependencies = (text: string): Dependency[] => {
  const matches = text.match(/\nDepends:\s(.+)\n/);
  if (!matches || !matches[1]) {
    // No dependencies for this package
    return [];
  }
  const dependenciesLine = matches[1];

  // 'libc6 (>= 2.2.5)' -> 'libc6'
  const parsePackageName = (packageString: string): string => (
    packageString.split(' ').shift()!
  );

  /*
   * E.g.  
   * 'libc6 (>= 2.2.5), dpkg (>= 1.15.4) | install-info' -> 
   * [{ main: 'libc6', alternatives: [] }, { main: 'dpkg', alternatives: ['install-info'] }]
   */
  const dependencies = dependenciesLine
    .split(', ')
    .map(string => {
      const packages = string.split(' | ')!;
      if (!packages || packages.length < 1) {
        throw new Error(`Invalid dependency format (${dependenciesLine})`);
      }
      const dependency = {
        main: parsePackageName(packages.shift()!),
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

export {
  getPackageDictionary
};
