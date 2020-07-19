import * as path from 'path';
import { readFiles } from '../utils/read_files';
import { rootDir } from './constants';

import { getClient } from '../lib/beatport';

const sourceFolder = path.join(
  rootDir,
  'Needs Definition'
);

console.log('=====> Looking for songs to populate');

try {
  (async function run() {
    const mp3Files = await readFiles(sourceFolder);
  
    const beatport = getClient();
  
    for (let i = 0; i < 1; i++) {
      const file = mp3Files[i];
      const parts = path.basename(file.path).split('.');
      const fileName = parts.slice(0, parts.length - 1).join('.');
      console.log(fileName);

      const results = await beatport.search(fileName);
      console.log(results);
    }
  })();
} 
catch (error) {
  console.error(error);
}

