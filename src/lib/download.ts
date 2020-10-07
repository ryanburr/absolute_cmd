import YoutubeDownloader from 'youtube-mp3-downloader';
import { ffmpegPath, downloadPath } from '../commands/constants';

export class DownloadClient {
  private _downloader: YoutubeDownloader;
  private _callbacks: { [key: string]: (err: any, data: any) => void } = {};

  constructor() {
    this._downloader = new YoutubeDownloader({
      ffmpegPath,
      outputPath: downloadPath,
      queueParallelism: 1,
      progressTimeout: 5000,
      youtubeVideoQuality: 'highest',
    });

    this._downloader.on('error', (err, data) => {
       console.error(err + ' on videoId ' + data?.videoId);
    
        if (data && this._callbacks[data.videoId]) {
            this._callbacks[data.videoId](err, data);
            delete this._callbacks[data.videoId];
        } else {
            console.log('Error: No callback for videoId!');
        }
    });

    this._downloader.on('finished', (err, data) => {
      if (data && this._callbacks[data.videoId]) {
        this._callbacks[data.videoId](err, data);
        delete this._callbacks[data.videoId];
      } else {
        console.log('Error: No callback for videoId!');
      }
    });
  }

  public async getTrack(id: string, name: string) {
    try {
      console.log('Getting track from DownloadClient');

      return new Promise<any>((resolve, reject) => {

        this._callbacks[id] = (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        };

        this._downloader.download(id, name);
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

let client: DownloadClient;
export const getClient = () => {
  if (!client) {
    client = new DownloadClient();
  }
  return client;
};
