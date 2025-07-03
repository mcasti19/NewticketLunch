import express from 'express';
import cors from 'cors';
import { scrapeData } from './scrape.js';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const data = await scrapeData();
    res.json({ success: true, data });
    console.log(data);
    
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});