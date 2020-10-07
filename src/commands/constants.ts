import * as fs from 'fs'; 
import * as path from 'path'; 

const { DOWNLOAD_PATH, FFMPEG_PATH } = process.env;

if (!FFMPEG_PATH) {
    throw new Error('Missing environment variable: FFMPEG_PATH');
}
export const ffmpegPath = path.resolve(FFMPEG_PATH);

if (!fs.existsSync(ffmpegPath)) {
    throw new Error(`FFMPEG_PATH not found: "${ffmpegPath}"`);
}
console.log(`FFMPEG_PATH found: "${ffmpegPath}"`);

if (!DOWNLOAD_PATH) {
    throw new Error('Missing environment variable: DOWNLOAD_PATH');
}
export const downloadPath = path.resolve(DOWNLOAD_PATH);

if (!fs.existsSync(downloadPath)) {
    throw new Error(`DOWNLOAD_PATH not found: "${downloadPath}"`);
}
console.log(`DOWNLOAD_PATH found: "${downloadPath}"`);
