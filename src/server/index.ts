import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';
import { getPackageDictionary } from './parser';

const port = 8080;

const app = express();
let distDir;

if (process.env.NODE_ENV === 'development') {
  app.use(cors());

  // var webpackDevMiddleware = require('webpack-dev-middleware');
  // var webpack = require('webpack');
  // var config = require('../../webpack.config');

  // const compiler = webpack(config);

  // console.log('PATH', config.output.path);

  // app.use(
  //   webpackDevMiddleware(compiler, {
  //     publicPath: config.output.publicPath
  //   })
  // );

  // app.get('/*', (req: express.Request, res: express.Response) => {
  //   res.sendFile(path.resolve('../render', 'index.html'));
  // });

} else {
 
}

// app.use(express.static(path.resolve(__dirname, distDir)));

app.get('/api/packages', async (req: express.Request, res: express.Response) => {
  const packageDictionary = await getPackageDictionary('./status.real.txt');
  res.json(packageDictionary);
});

app.get('/*', (req: express.Request, res: express.Response) => {
  res.sendFile(path.resolve('../render', 'index.html'));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
