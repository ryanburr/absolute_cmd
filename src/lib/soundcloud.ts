import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import soundcloudDownloader from 'soundcloud-downloader';
import { Stream } from 'stream';
import { needsDefinitionPath } from '../commands/constants';

export class SoundcloudClient {

  private readonly _url = 'https://soundcloud.com';
  private readonly _itemSelector = '.searchItem__trackItem.track'; 

  public async getTrack(uri: string, fileName: string) {
    try {
      const sanitizedName = 
        fileName
          .replace('.', '')
          .replace(':', '')
          .replace('/', '')
          .replace('?', '')
          .replace('<', '')
          .replace('>', '')
          .replace('\\', '')
          .replace('*', '')
          .replace('|', '')
          .replace('"', '');

      console.log(`writing file ${sanitizedName}`);
      
      await new Promise(async (resolve, reject) => {
        const stream: Stream = await soundcloudDownloader.download(`${this._url}${uri}`);

        stream.pipe(fs.createWriteStream(path.join(needsDefinitionPath, sanitizedName)));
        
        stream.on('end', () => resolve());
        stream.on('error', (err) => reject(err));
      });

      console.log(`${sanitizedName} saved`);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  public async search(query: string): Promise<any> {
    try {
      console.log('Searching soundcloud');
      
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      
      await page.goto(`${this._url}/search?q=${query.replace(' ', '%20')}`);
      await page.waitForSelector(this._itemSelector);

      const tracks = await page.$$(this._itemSelector);
      
      console.log(`${tracks.length} tracks found.`);

      const info = [];
      
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        const trackInfo = await this.getTrackInfoFromSearch(page, track);
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

  private async getTrackInfoFromSearch(page: puppeteer.Page, element: puppeteer.ElementHandle<Element>): Promise<any> {
    const artist = (await this._parseTextContent(element, '.soundTitle__secondary'));
    const title = await this._parseTextContent(element, '.soundTitle__title');
    const href = await element.$eval('.soundTitle__title', (el) => el.getAttribute('href'));
    // const href = await this._parseAttributeFromElement(titleElement, '@href') as string;

    return {
      title,
      artist,
      href
    };
  }

  private async _parseAttribute(page: puppeteer.Page, selector: string, attribute: string): Promise<any> {
    const element = await page.$$(selector);
    return this._parseAttributeFromElement(element[0], attribute);
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

  private async _parseTextContent(element: puppeteer.ElementHandle<HTMLElement> | puppeteer.Page, selector: string): Promise<any> {
    return element.$$eval(selector, el => {
      if (!el || !el[0]) {
        throw new Error(`No element found with selector '${selector}'`);
      }
      return el[0].textContent.trim();
    });
  }
}



let client: SoundcloudClient;
export const getClient = () => {
  if (!client) {
    client = new SoundcloudClient();
  }
  return client;
};

