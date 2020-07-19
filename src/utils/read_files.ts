import * as path from 'path';
import * as fs from 'fs';
import * as music from 'music-metadata';
import { Mp3File } from '../contracts/Mp3File';

export async function readFiles(root: string): Promise<Mp3File[]> {
  const files: Mp3File[] = [];

  try {
    const dir = fs.readdirSync(root);

    const results = await Promise.all(
      dir.map((name: string) => {
        const childPath = path.join(root, name);
        return readFiles(childPath);
      })
    );
    results.forEach(x => files.push(...x));
  } catch (error) {
    if (error.message.indexOf('ENOTDIR') > -1) {
      const mp3 = await getMp3(root);
      files.push({ mp3, path: root });
    } else {
      console.error(error);
      throw error;
    }
  }

  return files;
}

async function getMp3(path: string) {
  try {
    const data = await music.parseFile(path);
    return data;
  } catch (error) {
    console.error(error);
  }
}


