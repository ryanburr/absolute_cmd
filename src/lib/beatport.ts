import puppeteer from 'puppeteer';

export class BeatPort {

  private readonly _beatportUrl = 'https://beatport.com';
  private readonly _searchInput = '.search-autocomplete .text-input__input';

  private readonly _trackSelector = 'li.bucket-item.ec-item.track'; 

  public async getTrack(name: string, id: string) {
    try {
      console.log('Getting track from beatport');
      
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`${this._beatportUrl}/track/${name}/${id}`);

      const info = await this.getTrackInfoFromDetail(page); 

      await browser.close();

      return info;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  public async search(query: string): Promise<any> {
    try {
      console.log('Searching beatport');
      
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`${this._beatportUrl}/search?q=${query.replace(' ', '+')}`);
      
      // const searchInput = await page.$(this._searchInput);
      // await searchInput.type(query);
      // await searchInput.press('Enter');

      // await page.waitForSelector(this._trackSelector);
      const tracks = await page.$$(this._trackSelector);
      
      console.log(`${tracks.length} tracks found.`);

      const info = [];
      
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        const trackInfo = await this.getTrackInfoFromSearch(page, track);
        info.push(trackInfo);
      }

      await browser.close();

      return info;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  private async getTrackInfoFromDetail(page: puppeteer.Page): Promise<any> {
    const title = await this._parseTextContent(page, '.interior-title > h1:first-of-type');
    const remix = await this._parseTextContent(page, '.interior-title > h1:last-of-type');
    const artists = (await this._parseTextContent(page, '.interior-track-artists .value')).split(',').map(x => x.trim()).join(', ');
    
    const releaseDate = await this._parseTextContent(page, '.interior-track-content-item.interior-track-released > .value');
    const genre = (await this._parseTextContent(page, '.interior-track-content-item.interior-track-genre > .value')).split(', ').map(x => x.trim()).join(', ');
    const labels = (await this._parseTextContent(page, '.interior-track-content-item.interior-track-labels > .value')).split(', ').map(x => x.trim()).join(', ');
    const album = await this._parseAttribute(page, '.interior-track-releases-artwork-container', '@data-ec-name');
    

    return {
      title,
      remix,
      artists,
      releaseDate,
      genre,
      labels,
      album
    };
  }

  private async getTrackInfoFromSearch(page: puppeteer.Page, element: puppeteer.ElementHandle<Element>): Promise<any> {
    const beatportId = await this._parseAttributeFromElement(element, '@data-ec-id');
    
    const title = await this._parseTextContent(element, '.buk-track-primary-title');
    const remix = await this._parseTextContent(element, '.buk-track-remixed');
    
    const artists = await this._parseTextContent(element, '.buk-track-artists');
    const labels = await this._parseTextContent(element, '.buk-track-labels > a');
    
    const genre = await this._parseTextContent(element, '.buk-track-genre > a');
    
    const releaseDate = await this._parseTextContent(element, '.buk-track-released');

    const detailUrl = await this._parseAttributeFromElement(await element.$('.buk-track-title > a'), '@href');

    return {
      beatportId,
      title,
      remix,
      artists,
      labels,
      genre,
      releaseDate,
      detailUrl
    };
  }

  private async _parseAttributeFromElement(element: puppeteer.ElementHandle, attribute: string) {
    const result = await (await (await element.$x(`${attribute}`))[0].getProperty('value')).jsonValue();

    return result;
  }

  private async _parseAttribute(page: puppeteer.Page, selector: string, attribute: string): Promise<any> {
    const element = await page.$$(selector);
    return this._parseAttributeFromElement(element[0], attribute);
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

let client: BeatPort;
export const getClient = () => {
  if (!client) {
    client = new BeatPort();
  }
  return client;
};

