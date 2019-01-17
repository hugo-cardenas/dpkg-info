const express = require('express');
const app = express();
const port = 3000;

const { getPackages } = require('./parser');

getPackages('./status.real.txt')
  .then(packages => {
    console.log('TOTAL LENGTH', packages.length);
    packages.forEach(package => console.log(`${JSON.stringify(package, null, 2)}\n\n`))
  });


// app.get('/', (req, res) => res.send('Hello World!'));

// app.listen(port, () => console.log(`Example app listening on port ${port}!`));
