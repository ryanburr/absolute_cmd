import * as music from 'music-metadata';

 export interface Mp3File {
  mp3: music.IAudioMetadata;
  path: string;
}