import express from 'express';
import cors from 'cors';
import { getClient as getSpotifyClient } from './lib/spotify';
import { getClient as getBeatportClient } from './lib/beatport';
import { getClient as getYoutubeClient } from './lib/youtube';
import { getClient as getSoundcloudClient } from './lib/soundcloud';
import { assert } from 'console';

const {SPOTIFY_CLIENT_ID} = process.env;

assert(!!SPOTIFY_CLIENT_ID);

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());

app.get('/spotify/login', async (req, res) => {
  const scopes = 'user-library-read';
  console.log('Logging in to Spotify...');
  res.json('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + SPOTIFY_CLIENT_ID +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent('http://localhost:8000'));
  });

app.post('/spotify/auth', async (req, res) => {
  try {
    const code = req.body;
    const client = getSpotifyClient();
    await client.authenticate(code);
  } catch (err) {
    console.error('Failed to authenticate:', err.message);
    return res.status(err.statusCode ?? 500).send({message: err.message});
  }
});

app.get('/spotify/albums/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string') {
      return res.status(400).send({message: 'invalid album id'});
    }

    const client = getSpotifyClient();

    console.log('getting album');
    const response = await client.getAlbum(id);
    console.log('get album successful');
    return res.send(response);
  } catch (err) {
    console.error('failed to get album');
    return res.status(500).send({message: err.message});
  }
});

app.get('/beatport/track/:name/:id', async (req, res) => {
  try {
    const { id, name } = req.params;
    if (typeof id !== 'string' || typeof name !== 'string') {
      return res.status(400).send({message: 'invalid track id or name'});
    }

    const client = getBeatportClient();

    const response = await client.getTrack(name, id);
    return res.send(response);
  } catch (err) {
    console.error('failed to get track');
    return res.status(500).send({message: err.message});
  }
});

app.get('/beatport/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (typeof query !== 'string') {
      return res.status(400).send({message: 'query param must be of type string'});
    }

    const client = getBeatportClient();

    const response = await client.search(query);
    
    return res.send(response);
  } catch (err) {
    console.error('Failed to search for tracks');
    return res.status(500).send({message: err.message});
  }
});

app.get('/spotify/saved/tracks', async (req, res) => {
  try {
    const client = getSpotifyClient();

    console.log('getting saved tracks');
    const response = await client.getSavedTracks();
    console.log('get saved tracks successful');
    return res.send(response);
  } catch (err) {
    console.error('failed to get saved tracks:', err.message);
    return res.status(err.statusCode ?? 500).send({message: err.message});
  }
});

app.get('/youtube/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (typeof query !== 'string') {
      return res.status(400).send({message: 'query param must be of type string'});
    }

    const client = getYoutubeClient();

    const response = await client.search(query);
    
    return res.send(response);
  } catch (err) {
    console.error('Failed to search for tracks');
    return res.status(500).send({message: err.message});
  }
});

app.get('/youtube/watch', async (req, res) => {
  try {
    const { v, name } = req.query;
    if (typeof v !== 'string') {
      return res.status(400).send({message: 'v param must be of type string'});
    }

    const client = getYoutubeClient();

    const response = await client.getTrack(v, name as string);
    
    return res.send({});
  } catch (err) {
    console.error('Failed to search for tracks');
    return res.status(500).send({message: err.message});
  }
});


app.get('/soundcloud/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (typeof query !== 'string') {
      return res.status(400).send({message: 'query param must be of type string'});
    }

    const client = getSoundcloudClient();

    const response = await client.search(query);
    
    return res.send(response);
  } catch (err) {
    console.error('Failed to search for tracks');
    return res.status(500).send({message: err.message});
  }
});

app.listen(port, () => {
  console.log(`service started... listening on port ${port}`);
});