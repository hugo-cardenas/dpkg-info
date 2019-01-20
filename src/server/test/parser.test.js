const path = require('path');
const { getPackageDictionary } = require('../parser');

test('parse example file', async () => {
  const file = path.join(__dirname, 'example.txt');

  const packagesByName = await getPackageDictionary(file);

  const packages = Object.keys(packagesByName).map(name => packagesByName[name]);
  expect(packages).toHaveLength(4);

  expect(packages[0].name).toBe('python-pkg-resources');
  expect(packages[0].dependencies).toEqual([
    { main: 'python', alternatives: [] },
    { main: 'libslf4j-java', alternatives: [] },
    { main: 'libplexus-sec-dispatcher-java', alternatives: [] }
  ]);
  expect(packages[0].dependentPackages).toEqual([
    'libtext-wrapi18n-perl'
  ]);

  expect(packages[1].name).toBe('libslf4j-java');
  expect(packages[1].dependencies).toEqual([
    { main: 'libplexus-sec-dispatcher-java', alternatives: [] }
  ]);
  expect(packages[1].dependentPackages).toEqual([
    'python-pkg-resources'
  ]);

  expect(packages[2].name).toBe('libplexus-sec-dispatcher-java');
  expect(packages[2].dependencies).toEqual([
    { main: 'junit', alternatives: ['coreutils', 'cloudstack-common'] },
    { main: 'libplexus-cipher-java', alternatives: [] },
    { main: 'libplexus-container-default-java', alternatives: [] },
    { main: 'libplexus-utils-java', alternatives: ['sudo'] }
  ]);
  expect(packages[2].dependentPackages).toEqual([
    'python-pkg-resources',
    'libslf4j-java'
  ]);

  expect(packages[3].name).toBe('libtext-wrapi18n-perl');
  expect(packages[3].dependencies).toEqual([
    { main: 'libtext-charwidth-perl', alternatives: [] },
    { main: 'python-pkg-resources', alternatives: [] }
  ]);
  expect(packages[3].dependentPackages).toEqual([]);
});
