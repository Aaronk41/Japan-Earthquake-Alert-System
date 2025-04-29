const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// API endpoint
app.get('/api/earthquakes', async (req, res) => {
    try {
        console.log("Fetching earthquake data..."); // Debug log
        const response = await axios.get('https://www.jma.go.jp/bosai/quake/data/list.json');
        
        // Filter only relevant earthquakes (past 24 hours, magnitude 3+)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const filtered = response.data
            .filter(q => new Date(q.time) > oneDayAgo && q.mag >= 3)
            .sort((a, b) => new Date(b.time) - new Date(a.time));
        
        res.json(filtered);
    } catch (error) {
        console.error("Proxy error:", error);
        res.status(500).json({ error: "Failed to fetch earthquake data" });
    }
});

// Export for Vercel
module.exports = app;