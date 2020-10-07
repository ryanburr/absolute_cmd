import express from 'express';
import cors from 'cors';
import { getClient as getBeatportClient } from './lib/beatport';
import { getClient as getYoutubeClient } from './lib/youtube';
import { getClient as getSoundcloudClient } from './lib/soundcloud';

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());

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

app.get('/soundcloud/download', async (req, res) => {
  try {
    const { uri, name } = req.query;
    if (typeof uri !== 'string') {
      return res.status(400).send({message: 'uri param must be of type string'});
    }
    if (typeof name !== 'string') {
      return res.status(400).send({message: 'name param must be of type string'});
    }

    const client = getSoundcloudClient();

    await client.getTrack(uri, name.trim());
    
    return res.send({});
  } catch (err) {
    console.error('Failed to search for tracks');
    return res.status(500).send({message: err.message});
  }
});

app.listen(port, () => {
  console.log(`service started... listening on port ${port}`);
});