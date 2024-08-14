const express = require('express');
const axios = require('axios');
const connectDB = require('./db');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// Twitter API credentials from environment variables
const BEARER_TOKEN = process.env.BEARER_TOKEN;

// Route to fetch tweets
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

    // Log the full response
    console.log('Full Twitter API Response:', response.data);

    // Check if the response contains the 'data' field
    if (response.data && response.data.data) {
      const tweets = response.data.data.map(tweet => ({
        user: tweet.author_id, // Ensure this field exists
        text: tweet.text, // Ensure this field exists
      }));

      res.json(tweets);
    } else {
      // Log a warning if the data field is missing
      console.warn('No "data" field in response:', response.data);
      res.status(404).json({ error: 'No tweets found or invalid response structure.' });
    }
  } catch (error) {
    // Log the error details
    console.error('Error fetching tweets:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error fetching tweets' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
