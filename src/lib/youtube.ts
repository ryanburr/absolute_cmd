import puppeteer from 'puppeteer';
import { getClient as getDownloadClient } from './download';

export class YoutubeClient {

  private readonly _youtubeUrl = 'https://youtube.com';
  private readonly _itemSelector = '.ytd-item-section-renderer #video-title'; 

  public async getTrack(id: string, name: string) {
    try {
      const downloadClient = getDownloadClient();
      await downloadClient.getTrack(id, name);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  public async search(query: string): Promise<any> {
    try {
      console.log('Searching youtube');
      
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`${this._youtubeUrl}/results?search_query=${query.replace(' ', '+')}`);

      const tracks = await page.$$(this._itemSelector);
      
      console.log(`${tracks.length} tracks found.`);

      const info = [];
      
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        const trackInfo = await this.getTrackInfoFromSearch(track);
        if (trackInfo) {
          info.push(trackInfo);
        }
      }

      await browser.close();

      return info;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  private async getTrackInfoFromSearch(element: puppeteer.ElementHandle<Element>): Promise<any> {
    const title = await this._parseAttributeFromElement(element, '@title');
    const metadata = await this._parseAttributeFromElement(element, '@aria-label');
    const url = await this._parseAttributeFromElement(element, '@href') as string;
    const id = url?.split('=')[1];

    return {
      id,
      title,
      metadata,
      url
    };
  }

  private async _parseAttributeFromElement(element: puppeteer.ElementHandle, attribute: string) {
    const xpath = await element.$x(`${attribute}`);
    if (!xpath || xpath.length === 0) {
      return null;
    }

    const xpathValue = await xpath[0].getProperty('value');
    if (!xpathValue) {
      return null;
    }
    const result = await xpathValue.jsonValue();

    return result;
  }
}

let client: YoutubeClient;
export const getClient = () => {
  if (!client) {
    client = new YoutubeClient();
  }
  return client;
};

