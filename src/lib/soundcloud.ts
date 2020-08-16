import puppeteer from 'puppeteer';
import { getClient as getDownloadClient } from './download';

export class SoundcloudClient {

  private readonly _url = 'https://soundcloud.com';
  private readonly _itemSelector = '.searchItem__trackItem.track'; 

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
      console.log('Searching soundcloud');
      
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`${this._url}/search?q=${query.replace(' ', '%20')}`);

      const tracks = await page.$$(this._itemSelector);

      console.log('test');
      
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
    const artist = await this._parseTextContent(element, '.soundTitle__secondary');
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
      return el[0].textContent;
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

