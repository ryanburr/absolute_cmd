import * as path from 'path';
import * as fs from 'fs';

import { Mp3File } from '../contracts/Mp3File';
import { readFiles } from './read_files';

export async function readFolders(
  root: string
): Promise<{ [folder: string]: Mp3File[] }> {
  try {
    const map: { [key: string]: Mp3File[] } = {};
    const dir = fs.readdirSync(root);
    for (let i = 0; i < dir.length; i++) {
      const name = dir[i];
      const childPath = path.join(root, name);
      const files = await readFiles(childPath);
      map[name] = files;
    }

    return map;
  } catch (error) {
    console.error(error);
    throw error;
  }
}