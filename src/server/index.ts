import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';
import { getPackageDictionary } from './parser';

const port = 8080;
const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(cors());
}

app.use(express.static(path.resolve(__dirname, '../render')));

app.get('/api/packages', async (req: express.Request, res: express.Response) => {
  const packageDictionary = await getPackageDictionary('./status.real.txt');
  res.json(packageDictionary);
});

app.get('/*', (req: express.Request, res: express.Response) => {
  res.sendFile(path.resolve(__dirname, '../render', 'index.html'));
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
