import * as path from 'path';
import { readFiles } from '../utils/read_files';

const sourceFolder = path.join(
  'C:',
  'Users',
  'Ryan-ASUS',
  'Dropbox',
  'Absolute Lava',
  'Absolute Zero'
);

console.log(`...Finding songs with no genre in: ${sourceFolder}`);

run();

async function run() {
  const mp3Files = await readFiles(sourceFolder);

  const noGenreFiles = [];

  for (let i = 0; i < mp3Files.length; i++) {
    const file = mp3Files[i];
    if (!file.mp3.common.genre) {
      noGenreFiles.push(file);
    }
  }

  console.log(`==> ${mp3Files.length} file(s) searched`);
  console.log(`==> ${noGenreFiles.length} found with no genre`);

  noGenreFiles.forEach(x => console.log(x.path));
}

