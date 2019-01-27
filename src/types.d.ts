export interface Dependency {
  main: string;
  alternatives: Array<string>;
}

export interface Package {
  name: string;
  description: string;
  dependencies: Array<Dependency>;
  dependentPackages: Array<string>;
}

export interface PackageDictionary {
  [name: string]: Package
}
