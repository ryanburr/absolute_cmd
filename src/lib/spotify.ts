import { assert } from 'console';
import SpotifyWebApi from 'spotify-web-api-node';
import { ClientCredentialsGrantResponse } from '../contracts/spotify/ClientCredentialsGrantResponse';

const {SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET} = process.env;

assert(!!SPOTIFY_CLIENT_ID);
assert(!!SPOTIFY_CLIENT_SECRET);

class SpotifyClient {
  private _api: SpotifyWebApi;
  private _grant: ClientCredentialsGrantResponse;

  constructor() {
    console.log('initializing spotify client');

    this._api = new SpotifyWebApi({
      clientId: SPOTIFY_CLIENT_ID,
      clientSecret: SPOTIFY_CLIENT_SECRET,
    });
  }

  public async getAlbum(albumId: string) {
    try {
      // await this.authenticate();

      return this._api.getAlbum(albumId, { market: 'US' });
    } catch (err) {
      console.error('Error getting album');
      throw err;
    }
  }

  public async getTrack(trackId: string) {
    try {
      // await this.authenticate();

      return this._api.getTrack(trackId, { market: 'US' });
    } catch (err) {
      console.error('Error getting track');
      throw err;
    }
  }

  public async search(query: string) {
    try {
      // await this.authenticate();

      return this._api.search(query, ['track'], { market: 'US' });
    } catch (err) {
      console.error('Error searching');
      throw err;
    }
  }

  public async getSavedTracks() {
    try {
      // await this.authenticate();

      const result = await this._api.getMySavedTracks();

      return result;
    } catch (err) {
      console.error('Spotify error:', err.message);
      throw err;
    }
  }

  public async searchSongs() {
    try {
      // await this.authenticate();

      // this._api.searchTracks()
    } catch (err) {
      console.error('Error searching for songs', err);
      throw err;
    }
  }

  public async authenticate(code: string) {
    try {
      const data = await this._api.authorizationCodeGrant(code);
      
      console.log('The token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);
      console.log('The refresh token is ' + data.body['refresh_token']);
  
      // Set the access token on the API object to use it in later calls
      this._api.setAccessToken(data.body['access_token']);
      this._api.setRefreshToken(data.body['refresh_token']);
    } catch (err) {
      console.error('Error authenticating with Spotify:', err.message);
      throw err;
    }
  }
}

let client: SpotifyClient;
export const getClient = () => {
  if (!client) {
    client = new SpotifyClient();
  }
  return client;
};

