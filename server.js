const express = require('express');
const axios = require('axios');
const connectDB = require('./db');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;
connectDB();
app.use(express.json());
app.use(express.static('public'));
const BEARER_TOKEN = process.env.BEARER_TOKEN;
app.post('/getTweets', async (req, res) => {
  const query = req.body.query;
  if (!query) {
    return res.status(400).json({ error: 'No query provided' });
  }

  try {
    const response = await axios.get('https://api.twitter.com/2/tweets/search/recent', {
      params: { query, max_results: 5 },
      headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
    });
    console.log('Full Twitter API Response:', response.data);
    if (response.data && response.data.data) {
      const tweets = response.data.data.map(tweet => ({
        user: tweet.author_id, 
        text: tweet.text, 
      }));

      res.json(tweets);
    } else {
      console.warn('No "data" field in response:', response.data);
      res.status(404).json({ error: 'No tweets found or invalid response structure.' });
    }
  } catch (error) {
    console.error('Error fetching tweets:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error fetching tweets' });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
