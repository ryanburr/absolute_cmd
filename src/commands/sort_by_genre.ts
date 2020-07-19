import * as path from 'path';
import * as fs from 'fs';
import { readFiles } from '../utils/read_files';
import { readFolders } from '../utils/read_folders';


// ITunes
// const sourceFolder = path.join(
//   'C:',
//   'Users',
//   'Ryan-ASUS',
//   'Music',
//   'ITunes',
//   'iTunes Media',
//   'Music'
// );

// Sorting Bucket
const sourceFolder = path.join(
  'C:',
  'Users',
  'Ryan-ASUS',
  'Dropbox',
  'Absolute Lava',
  'Absolute Zero',
  'Need to Sort'
);

const destFolder = path.join(
  'C:',
  'Users',
  'Ryan-ASUS',
  'Dropbox',
  'Absolute Lava',
  'Absolute Zero',
  'Genre'
);

init();

async function init() {
  try {
    console.log('-----------------------');
    console.log(`Searching for music in: ${sourceFolder}`);
    console.log('---------');
    console.log(`Destination: ${destFolder}`);
    console.log('-----------------------');
    run();
  } catch(err) {
    console.error(err);
  }
}


async function run() {
  const mp3Files = await readFiles(sourceFolder);
  let genreFolders = await readFolders(destFolder);

  for (let i = 0; i < mp3Files.length; i++) {

    const sourceMp3 = mp3Files[i];
    const fileName = sourceMp3.path.split('\\')[sourceMp3.path.split('\\').length - 1];
    const genre = sourceMp3.mp3.common.genre;

    console.log(`\nsource_file: ${fileName}, genre: ${genre}`);

    if (!genre?.length) {
      console.warn('Cannot sort song: empty genre');
      continue;
    }

    const sourceGenre = genre[0].replace('/', '&');
    const foundGenre = Object.keys(genreFolders).find(
      x => isStringEqual(x, sourceGenre)
    );
    
    if (foundGenre) {
      console.log(`==> Source genre found: ${foundGenre}`);
      
      const existingMp3s = genreFolders[foundGenre];
      const source = sourceMp3.mp3.common;
      
      const doesFileExist = existingMp3s.some(x => {
        const target = x.mp3.common;
        return isStringEqual(source.artist, target.artist) && isStringEqual(source.title, target.title);
      });

      if (doesFileExist) {
        console.warn(`==> Song ${source.title} already exists... Skipping`);
      } else {
        const genreFolder = path.join(destFolder, foundGenre);
        const finalPath = path.join(genreFolder, fileName);

        console.log(`==> Copying to dest folder: ${genreFolder}`);
        
        fs.copyFileSync(sourceMp3.path, finalPath);
      }
    } else {
      if (!sourceGenre) {
        console.warn('==> Cannot sort song: empty genre');
        continue;
      }

      console.log('==> Creating genre folder...');
      
      // make folder
      const newGenrePath = path.join(destFolder, sourceGenre);
      fs.mkdirSync(newGenrePath);
      
      // move file
      const fileName = sourceMp3.path.split('\\')[sourceMp3.path.split('\\').length - 1];
      const finalPath = path.join(newGenrePath, fileName);
      console.log(`==> Copying to dest folder: ${newGenrePath}`);
      fs.copyFileSync(sourceMp3.path, finalPath);
      // fs.rmdirSync(sourceMp3.path);

      // reload genre folders after adding new folder
      genreFolders = await readFolders(destFolder);
    }
  }
}

function isStringEqual(a: string | null, b: string | null): boolean {
  return a && b && a.toLocaleLowerCase().trim() === b.toLocaleLowerCase().trim();
}